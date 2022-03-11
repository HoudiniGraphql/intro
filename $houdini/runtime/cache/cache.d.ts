import type { Config } from 'houdini-common';
import { GraphQLObject, GraphQLValue, SubscriptionSelection, SubscriptionSpec } from '..';
import { GarbageCollector } from './gc';
import { List, ListManager } from './lists';
import { InMemoryStorage, Layer, LayerID } from './storage';
import { InMemorySubscriptions } from './subscription';
export declare class Cache {
    _internal_unstable: CacheInternal;
    constructor(config: Config);
    write({ layer: layerID, ...args }: {
        data: {
            [key: string]: GraphQLValue;
        };
        selection: SubscriptionSelection;
        variables?: {};
        parent?: string;
        layer?: LayerID;
        applyUpdates?: boolean;
    }): LayerID;
    read(...args: Parameters<CacheInternal['getSelection']>): GraphQLObject;
    subscribe(spec: SubscriptionSpec, variables?: {}): void;
    unsubscribe(spec: SubscriptionSpec, variables?: {}): void;
    list(name: string, parentID?: string): List;
    delete(id: string): void;
}
declare class CacheInternal {
    private _disabled;
    config: Config;
    storage: InMemoryStorage;
    subscriptions: InMemorySubscriptions;
    lists: ListManager;
    cache: Cache;
    lifetimes: GarbageCollector;
    constructor({ config, storage, subscriptions, lists, cache, lifetimes, }: {
        storage: InMemoryStorage;
        config: Config;
        subscriptions: InMemorySubscriptions;
        lists: ListManager;
        cache: Cache;
        lifetimes: GarbageCollector;
    });
    writeSelection({ data, selection, variables, root, parent, applyUpdates, layer, toNotify, }: {
        data: {
            [key: string]: GraphQLValue;
        };
        selection: SubscriptionSelection;
        variables?: {
            [key: string]: GraphQLValue;
        };
        parent?: string;
        root?: string;
        layer: Layer;
        toNotify?: SubscriptionSpec[];
        applyUpdates?: boolean;
    }): SubscriptionSpec[];
    getSelection({ selection, parent, variables, }: {
        selection: SubscriptionSelection;
        parent?: string;
        variables?: {};
    }): GraphQLObject | null;
    id(type: string, data: {
        id?: string;
    } | null): string | null;
    id(type: string, id: string): string | null;
    idFields(type: string): string[];
    computeID(type: string, data: {
        [key: string]: GraphQLValue;
    }): string | undefined;
    hydrateNestedList({ fields, variables, linkedList, }: {
        fields: SubscriptionSelection;
        variables?: {};
        linkedList: LinkedList;
    }): LinkedList<GraphQLValue>;
    extractNestedListIDs({ value, abstract, recordID, key, linkedType, fields, variables, applyUpdates, specs, layer, }: {
        value: GraphQLValue[];
        recordID: string;
        key: string;
        linkedType: string;
        abstract: boolean;
        variables: {};
        specs: SubscriptionSpec[];
        applyUpdates: boolean;
        fields: SubscriptionSelection;
        layer: Layer;
    }): {
        nestedIDs: LinkedList;
        newIDs: (string | null)[];
    };
    isDataAvailable(target: SubscriptionSelection, variables: {}, parentID?: string): boolean;
    collectGarbage(): void;
}
export declare const rootID = "_ROOT_";
export declare type LinkedList<_Result = string> = (_Result | null | LinkedList<_Result>)[];
export {};
