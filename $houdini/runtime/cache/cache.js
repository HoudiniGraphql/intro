import { GarbageCollector } from './gc';
import { ListManager } from './lists';
import { InMemoryStorage } from './storage';
import { evaluateKey, flattenList } from './stuff';
import { InMemorySubscriptions } from './subscription';
export class Cache {
    constructor(config) {
        this._internal_unstable = new CacheInternal({
            cache: this,
            config,
            storage: new InMemoryStorage(),
            subscriptions: new InMemorySubscriptions(this),
            lists: new ListManager(rootID),
            lifetimes: new GarbageCollector(this, config.cacheBufferSize),
        });
    }
    // walk down the selection and save the values that we encounter.
    // any changes will notify subscribers. writing to an optimistic layer will resolve it
    write({ layer: layerID, ...args }) {
        var _a;
        // find the correct layer
        const layer = layerID
            ? this._internal_unstable.storage.getLayer(layerID)
            : this._internal_unstable.storage.topLayer;
        // write any values that we run into and get a list of subscribers
        const subscribers = this._internal_unstable.writeSelection({ ...args, layer });
        // the same spec will likely need to be updated multiple times, create the unique list by using the set
        // function's identity
        const notified = [];
        for (const spec of subscribers) {
            // if we haven't added the set yet
            if (!notified.includes(spec.set)) {
                notified.push(spec.set);
                // trigger the update
                spec.set(this._internal_unstable.getSelection({
                    parent: spec.parentID || rootID,
                    selection: spec.selection,
                    variables: ((_a = spec.variables) === null || _a === void 0 ? void 0 : _a.call(spec)) || {},
                }));
            }
        }
        // return the id to the caller so they can resolve the layer if it was optimistic
        return layer.id;
    }
    // reconstruct an object with the fields/relations specified by a selection
    read(...args) {
        return this._internal_unstable.getSelection(...args);
    }
    // register the provided callbacks with the fields specified by the selection
    subscribe(spec, variables = {}) {
        // add the subscribers to every field in the specification
        return this._internal_unstable.subscriptions.add({
            parent: spec.parentID || rootID,
            spec,
            selection: spec.selection,
            variables,
        });
    }
    // stop listening to a particular subscription
    unsubscribe(spec, variables = {}) {
        return this._internal_unstable.subscriptions.remove(spec.parentID || rootID, spec.selection, [spec], variables);
    }
    // return the list handler to mutate a named list in the cache
    list(name, parentID) {
        const handler = this._internal_unstable.lists.get(name, parentID);
        if (!handler) {
            throw new Error(`Cannot find list with name: ${name}${parentID ? 'under parent ' + parentID : ''}. ` + 'Is it possible that the query is not mounted?');
        }
        // return the handler
        return handler;
    }
    // remove the record from the cache's store and unsubscribe from it
    delete(id) {
        // clean up any subscribers associated with the record before we destroy the actual values that will let us
        // walk down
        this._internal_unstable.subscriptions.removeAllSubscribers(id);
        // make sure we remove the id from any lists that it appears in
        this._internal_unstable.lists.removeIDFromAllLists(id);
        // delete the record from the store
        this._internal_unstable.storage.delete(id);
    }
}
class CacheInternal {
    constructor({ config, storage, subscriptions, lists, cache, lifetimes, }) {
        // for server-side requests we need to be able to flag the cache as disabled so we dont write to it
        this._disabled = false;
        this.config = config;
        this.storage = storage;
        this.subscriptions = subscriptions;
        this.lists = lists;
        this.cache = cache;
        this.lifetimes = lifetimes;
        // the cache should always be disabled on the server
        try {
            this._disabled = typeof window === 'undefined';
        }
        catch {
            this._disabled = true;
        }
    }
    writeSelection({ data, selection, variables = {}, root = rootID, parent = rootID, applyUpdates = false, layer, toNotify = [], }) {
        var _a;
        // if the cache is disabled, dont do anything
        if (this._disabled) {
            return [];
        }
        // data is an object with fields that we need to write to the store
        for (const [field, value] of Object.entries(data)) {
            // grab the selection info we care about
            if (!selection || !selection[field]) {
                throw new Error('Could not find field listing in selection for ' +
                    field +
                    ' @ ' +
                    JSON.stringify(selection) +
                    '');
            }
            // look up the field in our schema
            let { type: linkedType, keyRaw, fields, operations, abstract: isAbstract, update, } = selection[field];
            const key = evaluateKey(keyRaw, variables);
            // the current set of subscribers
            const currentSubcribers = this.subscriptions.get(parent, key);
            // look up the previous value
            const { value: previousValue, displayLayers } = this.storage.get(parent, key);
            // if the layer we are updating is the top most layer for the field
            // then its value is "live", it is providing the current value and
            // subscribers need to know if the value changed
            const displayLayer = displayLayers.length === 0 || displayLayers.includes(layer.id);
            // if we are writing to the display layer we need to refresh the lifetime of the value
            if (displayLayer) {
                this.lifetimes.resetLifetime(parent, key);
            }
            // any non-scalar is defined as a field with no selection
            if (!fields) {
                // the value to write to the layer
                let newValue = value;
                // if the value is an array, we might have to apply updates
                if (Array.isArray(value) && applyUpdates && update) {
                    // if we have to prepend the new value on the old one
                    if (update === 'append') {
                        newValue = (previousValue || []).concat(value);
                    }
                    // we might have to prepend our value onto the old one
                    else if (update === 'prepend') {
                        newValue = value.concat(previousValue || []);
                    }
                }
                // if the value changed on a layer that impacts the current latest value
                const valueChanged = JSON.stringify(newValue) !== JSON.stringify(previousValue);
                if (valueChanged && displayLayer) {
                    // we need to add the fields' subscribers to the set of callbacks
                    // we need to invoke
                    toNotify.push(...currentSubcribers);
                }
                // write value to the layer
                layer.writeField(parent, key, newValue);
            }
            // the field could point to a linked object
            else if (value instanceof Object && !Array.isArray(value)) {
                // the previous value is a string holding the id of the object to link to
                // if we ran into an interface we need to look at the __typename field
                if (isAbstract) {
                    // make sure we have a __typename field
                    if (!value.__typename) {
                        throw new Error('Encountered interface type without __typename in the payload');
                    }
                    // we need to look at the __typename field in the response for the type
                    linkedType = value.__typename;
                }
                // figure out if this is an embedded object or a linked one by looking for all of the fields marked as
                // required to compute the entity's id
                const embedded = ((_a = this.idFields(linkedType)) === null || _a === void 0 ? void 0 : _a.filter((field) => typeof value[field] === 'undefined').length) > 0;
                // figure out the new target of the object link
                let linkedID = null;
                if (value !== null) {
                    linkedID = !embedded ? this.id(linkedType, value) : `${parent}.${key}`;
                }
                let linkChange = linkedID !== previousValue;
                // write the link to the layer
                layer.writeLink(parent, key, linkedID);
                // if the link target of this field changed and it was responsible for the current subscription
                if (linkedID && displayLayer && linkChange) {
                    // if there was an old subscriber we are forgotten
                    if (previousValue && typeof previousValue === 'string') {
                        this.subscriptions.remove(previousValue, fields, currentSubcribers, variables);
                    }
                    // we need to clear the subscriptions in the previous link
                    // and add them to the new link
                    toNotify.push(...currentSubcribers);
                }
                // if the link target points to another record in the cache we need to walk down its
                // selection and update any values we run into
                if (linkedID) {
                    this.writeSelection({
                        root,
                        selection: fields,
                        parent: linkedID,
                        data: value,
                        variables,
                        toNotify,
                        applyUpdates,
                        layer,
                    });
                }
            }
            // the field could point to a list of related objects
            else if (Array.isArray(value) &&
                // make typescript happy
                (typeof previousValue === 'undefined' || Array.isArray(previousValue))) {
                // make a shallow copy of the previous value we can  mutate
                let oldIDs = [...(previousValue || [])];
                // this field could be a connection (a list of references to edge objects).
                // inserts in this list might insert objects into the connection that
                // have already been added as part of a list operation. if that happens
                // we will need to filter out ids that refer to these fake-edges which
                // can be idenfitied as not having a cursor or node value
                const emptyEdges = !update
                    ? []
                    : oldIDs.map((id) => {
                        if (!id) {
                            return '';
                        }
                        // look up the edge record
                        const { value: cursorField } = this.storage.get(id, 'cursor');
                        // if there is a value for the cursor, it needs to remain
                        if (cursorField) {
                            return '';
                        }
                        // look up the node reference
                        const { value: node } = this.storage.get(id, 'node');
                        // if there one, keep the edge
                        if (!node) {
                            return '';
                        }
                        // there is no cursor
                        return node;
                    });
                // if we are supposed to prepend or append and the mutation is enabled
                // the new list of IDs for this link will start with an existing value
                // build up the list of linked ids
                let linkedIDs = [];
                // it could be a list of lists, in order to recreate the list of lists we need
                // we need to track two sets of IDs, the ids of the embedded records and
                // then the full structure of embedded lists. we'll use the flat list to add
                // and remove subscribers but we'll save the second list in the record so
                // we can recreate the structure
                const { newIDs, nestedIDs } = this.extractNestedListIDs({
                    value,
                    abstract: Boolean(isAbstract),
                    specs: toNotify,
                    applyUpdates,
                    recordID: parent,
                    key,
                    linkedType,
                    variables: variables,
                    fields,
                    layer,
                    startingWith: applyUpdates && update === 'append' ? oldIDs.length : 0,
                });
                // if we're supposed to apply this write as an update, we need to figure out how
                if (applyUpdates && update) {
                    // if we are updating the edges field, we might need to do a little more than just
                    // append/prepend to the field value. we might need to wrap the values in extra references
                    if (key === 'edges') {
                        // build up a list of the ids found in the new list
                        const newNodeIDs = [];
                        for (const id of newIDs) {
                            if (!id) {
                                continue;
                            }
                            // look up the lined node record
                            const { value: node } = this.storage.get(id, 'node');
                            // node should be a reference
                            if (typeof node !== 'string') {
                                continue;
                            }
                            // if we dont have type information or a valid reference
                            if (!node || !this.storage.get(node, '__typename')) {
                                continue;
                            }
                            newNodeIDs.push(node);
                        }
                        // only save a previous ID if the id shows up in the new list and was previously empty,
                        oldIDs = oldIDs.filter((id) => {
                            if (!id) {
                                return true;
                            }
                            // look up the node reference
                            const { value } = this.storage.get(id, 'node');
                            const node = value;
                            // if the id is being adding and is part of the empty edges, don't include it
                            if (newNodeIDs.includes(node) && emptyEdges.includes(node)) {
                                return false;
                            }
                            // the id is not being replaced by a "real" version
                            return true;
                        });
                    }
                    // if we have to prepend it, do so
                    if (update === 'prepend') {
                        linkedIDs = newIDs.concat(oldIDs);
                    }
                    // otherwise we might have to append it
                    else if (update === 'append') {
                        linkedIDs = oldIDs.concat(newIDs);
                    }
                    // if the update is a replace do the right thing
                    else if (update === 'replace') {
                        linkedIDs = newIDs;
                    }
                }
                // we're not supposed to apply this write as an update, just use the new value
                else {
                    linkedIDs = nestedIDs;
                }
                // we have to notify the subscribers if a few things happen:
                // either the data changed (ie we got new content for the same list)
                // or we got content for a new list which could already be known. If we just look at
                // wether the IDs are the same, situations where we have old data that
                // is still valid would not be triggered
                const contentChanged = JSON.stringify(linkedIDs) !== JSON.stringify(oldIDs);
                // we need to look at the last time we saw each subscriber to check if they need to be added to the spec
                for (const subscriber of currentSubcribers) {
                    // if either are true, add the subscriber to the list
                    if (contentChanged) {
                        toNotify.push(subscriber);
                    }
                }
                // any ids that don't show up in the new list need to have their subscribers wiped
                for (const lostID of oldIDs) {
                    if (linkedIDs.includes(lostID) || !lostID) {
                        continue;
                    }
                    this.subscriptions.remove(lostID, fields, currentSubcribers, variables);
                }
                // if there was a change in the list
                if (contentChanged || (oldIDs.length === 0 && newIDs.length === 0)) {
                    // update the cached value
                    layer.writeLink(parent, key, linkedIDs);
                }
            }
            // handle any operations relative to this node
            for (const operation of operations || []) {
                // turn the ID into something we can use
                let parentID;
                if (operation.parentID) {
                    // if its a normal scalar we can use the value directly
                    if (operation.parentID.kind !== 'Variable') {
                        parentID = operation.parentID.value;
                    }
                    else {
                        const id = variables[operation.parentID.value];
                        if (typeof id !== 'string') {
                            throw new Error('parentID value must be a string');
                        }
                        parentID = id;
                    }
                }
                // there could be a list of elements to perform the operation on
                const targets = Array.isArray(value) ? value : [value];
                for (const target of targets) {
                    // only insert an object into a list if we're adding an object with fields
                    if (operation.action === 'insert' &&
                        target instanceof Object &&
                        fields &&
                        operation.list) {
                        this.cache
                            .list(operation.list, parentID)
                            .when(operation.when)
                            .addToList(fields, target, variables, operation.position || 'last');
                    }
                    // only insert an object into a list if we're adding an object with fields
                    else if (operation.action === 'remove' &&
                        target instanceof Object &&
                        fields &&
                        operation.list) {
                        this.cache
                            .list(operation.list, parentID)
                            .when(operation.when)
                            .remove(target, variables);
                    }
                    // delete the target if we have to
                    else if (operation.action === 'delete' && operation.type) {
                        if (typeof target !== 'string') {
                            throw new Error('Cannot delete a record with a non-string ID');
                        }
                        const targetID = this.id(operation.type, target);
                        if (!targetID) {
                            continue;
                        }
                        this.cache.delete(targetID);
                    }
                    // the toggle operation
                    else if (operation.action === 'toggle' &&
                        target instanceof Object &&
                        fields &&
                        operation.list) {
                        this.cache
                            .list(operation.list, parentID)
                            .when(operation.when)
                            .toggleElement(fields, target, variables, operation.position || 'last');
                    }
                }
            }
        }
        // return the list of subscribers that need to be updated because of this change
        return toNotify;
    }
    // reconstruct an object defined by its selection
    getSelection({ selection, parent = rootID, variables, }) {
        var _a, _b;
        // we could be asking for values of null
        if (parent === null) {
            return null;
        }
        const target = {};
        // look at every field in the parentFields
        for (const [attributeName, { type, keyRaw, fields }] of Object.entries(selection)) {
            const key = evaluateKey(keyRaw, variables);
            // look up the value in our store
            const { value } = this.storage.get(parent, key);
            // if the value is null
            if (value === null) {
                target[attributeName] = null;
                continue;
            }
            // if the field is a scalar
            if (!fields) {
                // is the type a custom scalar with a specified unmarshal function
                if ((_b = (_a = this.config.scalars) === null || _a === void 0 ? void 0 : _a[type]) === null || _b === void 0 ? void 0 : _b.unmarshal) {
                    // pass the primitive value to the unmarshal function
                    target[attributeName] = this.config.scalars[type].unmarshal(value);
                }
                // the field does not have an unmarshal function
                else {
                    target[attributeName] = value;
                }
                // we're done
                continue;
            }
            // if the field is a list of records
            else if (Array.isArray(value)) {
                // the linked list could be a deeply nested thing, we need to call getData for each record
                target[attributeName] = this.hydrateNestedList({
                    fields,
                    variables,
                    linkedList: value,
                });
            }
            // otherwise the field is an object
            else {
                // if we dont have a value, use null
                target[attributeName] = !value
                    ? null
                    : this.getSelection({
                        parent: value,
                        selection: fields,
                        variables,
                    });
                continue;
            }
        }
        return target;
    }
    id(type, data) {
        // try to compute the id of the record
        const id = typeof data === 'string' ? data : this.computeID(type, data);
        if (!id) {
            return null;
        }
        return type + ':' + id;
    }
    // the list of fields that we need in order to compute an objects id
    idFields(type) {
        return ['id'];
    }
    computeID(type, data) {
        return data.id;
    }
    hydrateNestedList({ fields, variables, linkedList, }) {
        // the linked list could be a deeply nested thing, we need to call getData for each record
        // we can't mutate the lists because that would change the id references in the listLinks map
        // to the corresponding record. can't have that now, can we?
        return linkedList.map((entry) => {
            // if the entry is an array, keep going
            if (Array.isArray(entry)) {
                return this.hydrateNestedList({ fields, variables, linkedList: entry });
            }
            // the entry could be null
            if (entry === null) {
                return entry;
            }
            // look up the data for the record
            return this.getSelection({ parent: entry, selection: fields, variables });
        });
    }
    extractNestedListIDs({ value, abstract, recordID, key, linkedType, fields, variables, applyUpdates, specs, layer, startingWith, }) {
        var _a;
        // build up the two lists
        const nestedIDs = [];
        const newIDs = [];
        let id = 0;
        for (const [i, entry] of value.entries()) {
            // if we found another list
            if (Array.isArray(entry)) {
                // compute the nested list of ids
                const inner = this.extractNestedListIDs({
                    value: entry,
                    abstract,
                    recordID,
                    key,
                    linkedType,
                    fields,
                    variables,
                    applyUpdates,
                    specs,
                    layer,
                    startingWith,
                });
                // add the list of new ids to our list
                newIDs.push(...inner.newIDs);
                // and use the nested form in place of it
                nestedIDs[i] = inner.nestedIDs;
                continue;
            }
            // if the value is null just use that
            if (entry === null || typeof entry === 'undefined') {
                newIDs.push(null);
                nestedIDs[i] = null;
                continue;
            }
            // we know now that entry is an object
            const entryObj = entry;
            // start off building up the embedded id
            let linkedID = `${recordID}.${key}[${startingWith + id++}]`;
            // figure out if this is an embedded list or a linked one by looking for all of the fields marked as
            // required to compute the entity's id
            const embedded = ((_a = this.idFields(linkedType)) === null || _a === void 0 ? void 0 : _a.filter((field) => typeof entry[field] === 'undefined').length) > 0;
            const typename = entryObj.__typename;
            let innerType = linkedType;
            // if we ran into an interface
            if (abstract) {
                // make sure we have a __typename field
                if (!typename) {
                    throw new Error('Encountered interface type without __typename in the payload');
                }
                // we need to look at the __typename field in the response for the type
                innerType = typename;
            }
            // build up an
            if (!embedded) {
                const id = this.id(innerType, entry);
                if (id) {
                    linkedID = id;
                }
                else {
                    continue;
                }
            }
            // update the linked fields too
            this.writeSelection({
                root: rootID,
                selection: fields,
                parent: linkedID,
                data: entryObj,
                variables,
                toNotify: specs,
                applyUpdates,
                layer,
            });
            newIDs.push(linkedID);
            nestedIDs[i] = linkedID;
        }
        return { newIDs, nestedIDs };
    }
    isDataAvailable(target, variables, parentID = rootID) {
        // if the cache is disabled we dont have to look at anything else
        if (this._disabled) {
            return false;
        }
        // every field in the selection needs to be present
        for (const selection of Object.values(target)) {
            const fieldName = evaluateKey(selection.keyRaw, variables);
            // look up the field value
            const { value, kind } = this.storage.get(parentID, fieldName);
            // if the field is a scalar and has a value, we're good (no need to check a subselection)
            if (kind === 'scalar' && typeof value !== 'undefined') {
                continue;
            }
            // if the field has no value and there are no subselections and we dont have a value, we are missing data
            else if (!selection.fields) {
                return false;
            }
            // the link could be an object
            else if (!Array.isArray(value)) {
                // if we have a null value we're good
                if (value === null) {
                    continue;
                }
                // if we have a valid id, walk down
                if (!this.isDataAvailable(selection.fields, variables, value)) {
                    return false;
                }
            }
            // the link is a list
            else {
                // we need to look at every linked record
                for (const linkedRecord of flattenList(value)) {
                    if (!linkedRecord) {
                        continue;
                    }
                    // if the linked record doesn't have the field then we are missing data
                    if (!this.isDataAvailable(selection.fields, variables, linkedRecord)) {
                        return false;
                    }
                }
            }
            // if we dont have a linked record or linked list, we dont have the data
            if (typeof value === 'undefined') {
                return false;
            }
        }
        // if we got this far, we have the information
        return true;
    }
    collectGarbage() {
        // increment the lifetimes of unused data
        this.lifetimes.tick();
        // if there is only one layer in the cache, clean up the data
        if (this.storage.layerCount === 1) {
            this.storage.topLayer.applyDeletes();
        }
    }
}
// fields on the root of the data store are keyed with a fixed id
export const rootID = '_ROOT_';
