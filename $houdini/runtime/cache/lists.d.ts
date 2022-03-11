import { SubscriptionSelection, ListWhen, SubscriptionSpec } from '../types';
import type { Cache } from './cache';
export declare class ListManager {
    rootID: string;
    constructor(rootID: string);
    private lists;
    get(listName: string, id?: string): List;
    remove(listName: string, id: string): void;
    set(list: {
        name: string;
        connection: boolean;
        cache: Cache;
        recordID: string;
        key: string;
        listType: string;
        selection: SubscriptionSelection;
        when?: ListWhen;
        filters?: List['filters'];
        parentID: SubscriptionSpec['parentID'];
    }): void;
    removeIDFromAllLists(id: string): void;
}
export declare class List {
    readonly recordID: string;
    readonly key: string;
    readonly listType: string;
    private cache;
    readonly selection: SubscriptionSelection;
    private _when?;
    private filters?;
    readonly name: string;
    readonly parentID: SubscriptionSpec['parentID'];
    private connection;
    private manager;
    constructor({ name, cache, recordID, key, listType, selection, when, filters, parentID, connection, manager, }: Parameters<ListManager['set']>[0] & {
        manager: ListManager;
    });
    when(when?: ListWhen): List;
    append(selection: SubscriptionSelection, data: {}, variables?: {}): void;
    prepend(selection: SubscriptionSelection, data: {}, variables?: {}): void;
    addToList(selection: SubscriptionSelection, data: {}, variables: {}, where: 'first' | 'last'): void;
    removeID(id: string, variables?: {}): void;
    remove(data: {}, variables?: {}): void;
    private validateWhen;
    [Symbol.iterator](): Generator<string, void, unknown>;
}
