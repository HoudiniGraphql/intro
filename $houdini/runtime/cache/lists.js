import { flattenList } from './stuff';
export class ListManager {
    constructor(rootID) {
        // associate list names with the handler that wraps the list
        this.lists = new Map();
        this.rootID = rootID;
    }
    get(listName, id) {
        var _a;
        return (_a = this.lists.get(listName)) === null || _a === void 0 ? void 0 : _a.get(id || this.rootID);
    }
    remove(listName, id) {
        var _a;
        (_a = this.lists.get(listName)) === null || _a === void 0 ? void 0 : _a.delete(id || this.rootID);
    }
    set(list) {
        var _a;
        // if we haven't seen this list before
        if (!this.lists.has(list.name)) {
            this.lists.set(list.name, new Map());
        }
        // set the list reference
        (_a = this.lists
            .get(list.name)) === null || _a === void 0 ? void 0 : _a.set(list.parentID || this.rootID, new List({ ...list, manager: this }));
    }
    removeIDFromAllLists(id) {
        for (const fieldMap of this.lists.values()) {
            for (const list of fieldMap.values()) {
                list.removeID(id);
            }
        }
    }
}
export class List {
    constructor({ name, cache, recordID, key, listType, selection, when, filters, parentID, connection, manager, }) {
        this.recordID = recordID;
        this.key = key;
        this.listType = listType;
        this.cache = cache;
        this.selection = selection;
        this._when = when;
        this.filters = filters;
        this.name = name;
        this.parentID = parentID;
        this.connection = connection;
        this.manager = manager;
    }
    // when applies a when condition to a new list pointing to the same spot
    when(when) {
        return new List({
            cache: this.cache,
            recordID: this.recordID,
            key: this.key,
            listType: this.listType,
            selection: this.selection,
            when,
            filters: this.filters,
            parentID: this.parentID,
            name: this.name,
            connection: this.connection,
            manager: this.manager,
        });
    }
    append(selection, data, variables = {}) {
        return this.addToList(selection, data, variables, 'last');
    }
    prepend(selection, data, variables = {}) {
        return this.addToList(selection, data, variables, 'first');
    }
    addToList(selection, data, variables = {}, where) {
        // figure out the id of the type we are adding
        const dataID = this.cache._internal_unstable.id(this.listType, data);
        // if there are conditions for this operation
        if (!this.validateWhen() || !dataID) {
            return;
        }
        // we are going to implement the insert as a write with an update flag on a field
        // that matches the key of the list. We'll have to embed the lists data and selection
        // in the appropriate objects
        let insertSelection = selection;
        let insertData = data;
        // if we are wrapping a connection, we have to embed the data under edges > node
        if (this.connection) {
            insertSelection = {
                newEntry: {
                    keyRaw: this.key,
                    type: 'Connection',
                    fields: {
                        edges: {
                            keyRaw: 'edges',
                            type: 'ConnectionEdge',
                            update: (where === 'first' ? 'prepend' : 'append'),
                            fields: {
                                node: {
                                    type: this.listType,
                                    keyRaw: 'node',
                                    fields: {
                                        ...selection,
                                        __typename: {
                                            keyRaw: '__typename',
                                            type: 'String',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            };
            insertData = {
                newEntry: {
                    edges: [{ node: { ...data, __typename: this.listType } }],
                },
            };
        }
        else {
            insertSelection = {
                newEntries: {
                    keyRaw: this.key,
                    type: this.listType,
                    update: (where === 'first' ? 'prepend' : 'append'),
                    fields: {
                        ...selection,
                        __typename: {
                            keyRaw: '__typename',
                            type: 'String',
                        },
                    },
                },
            };
            insertData = {
                newEntries: [{ ...data, __typename: this.listType }],
            };
        }
        // update the cache with the data we just found
        this.cache.write({
            selection: insertSelection,
            data: insertData,
            variables,
            parent: this.recordID,
            applyUpdates: true,
        });
    }
    removeID(id, variables = {}) {
        var _a;
        // if there are conditions for this operation
        if (!this.validateWhen()) {
            return;
        }
        // if we are removing from a connection, the id we are removing from
        // has to be computed
        let parentID = this.recordID;
        let targetID = id;
        let targetKey = this.key;
        // if we are removing a record from a connection we have to walk through
        // some embedded references first
        if (this.connection) {
            const { value: embeddedConnection } = this.cache._internal_unstable.storage.get(this.recordID, this.key);
            if (!embeddedConnection) {
                return;
            }
            const embeddedConnectionID = embeddedConnection;
            // look at every embedded edge for the one with a node corresponding to the element
            // we want to delete
            const { value: edges } = this.cache._internal_unstable.storage.get(embeddedConnectionID, 'edges');
            for (const edge of flattenList(edges) || []) {
                if (!edge) {
                    continue;
                }
                const edgeID = edge;
                // look at the edge's node
                const { value: nodeID } = this.cache._internal_unstable.storage.get(edgeID, 'node');
                if (!nodeID) {
                    continue;
                }
                // if we found the node
                if (nodeID === id) {
                    targetID = edgeID;
                }
            }
            parentID = embeddedConnectionID;
            targetKey = 'edges';
        }
        // if the id is not contained in the list, dont notify anyone
        const value = this.cache._internal_unstable.storage.get(parentID, targetKey)
            .value;
        if (!value || !value.includes(targetID)) {
            return;
        }
        // get the list of specs that are subscribing to the list
        const subscribers = this.cache._internal_unstable.subscriptions.get(this.recordID, this.key);
        // disconnect record from any subscriptions associated with the list
        this.cache._internal_unstable.subscriptions.remove(targetID, 
        // if we are unsubscribing from a connection, the fields we care about
        // are tucked away under edges
        this.connection ? this.selection.edges.fields : this.selection, subscribers, variables);
        // remove the target from the parent
        this.cache._internal_unstable.storage.remove(parentID, targetKey, targetID);
        // notify the subscribers about the change
        for (const spec of subscribers) {
            // trigger the update
            spec.set(this.cache._internal_unstable.getSelection({
                parent: spec.parentID || this.manager.rootID,
                selection: spec.selection,
                variables: ((_a = spec.variables) === null || _a === void 0 ? void 0 : _a.call(spec)) || {},
            }).data);
        }
        // if we are removing from a connection, delete the embedded edge holding the record
        if (this.connection) {
            this.cache._internal_unstable.storage.delete(targetID);
        }
        // return true if we deleted something
        return true;
    }
    remove(data, variables = {}) {
        const targetID = this.cache._internal_unstable.id(this.listType, data);
        if (!targetID) {
            return;
        }
        // figure out the id of the type we are adding
        return this.removeID(targetID, variables);
    }
    validateWhen() {
        // if this when doesn't apply, we should look at others to see if we should update those behind the scenes
        let ok = true;
        // if there are conditions for this operation
        if (this._when) {
            // we only NEED there to be target filters for must's
            const targets = this.filters;
            // check must's first
            if (this._when.must && targets) {
                ok = Object.entries(this._when.must).reduce((prev, [key, value]) => Boolean(prev && targets[key] == value), ok);
            }
            // if there are no targets, nothing could be true that can we compare against
            if (this._when.must_not) {
                ok =
                    !targets ||
                        Object.entries(this._when.must_not).reduce((prev, [key, value]) => Boolean(prev && targets[key] != value), ok);
            }
        }
        return ok;
    }
    toggleElement(selection, data, variables = {}, where) {
        // if we dont have something to remove, then add it instead
        if (!this.remove(data, variables)) {
            this.addToList(selection, data, variables, where);
        }
    }
    // iterating over the list handler should be the same as iterating over
    // the underlying linked list
    *[Symbol.iterator]() {
        for (let record of flattenList(this.cache._internal_unstable.storage.get(this.recordID, this.key).value)) {
            yield record;
        }
    }
}
