import { SubscriptionSpec, SubscriptionSelection } from '../types';
import { Cache } from './cache';
import { GraphQLValue } from '..';
export declare class InMemorySubscriptions {
    private cache;
    constructor(cache: Cache);
    private subscribers;
    private referenceCounts;
    private keyVersions;
    add({ parent, spec, selection, variables, }: {
        parent: string;
        spec: SubscriptionSpec;
        selection: SubscriptionSelection;
        variables: {
            [key: string]: GraphQLValue;
        };
    }): void;
    addFieldSubscription(id: string, field: string, spec: SubscriptionSpec): void;
    addMany({ parent, selection, variables, subscribers, }: {
        parent: string;
        selection: SubscriptionSelection;
        variables: {};
        subscribers: SubscriptionSpec[];
    }): void;
    get(id: string, field: string): SubscriptionSpec[];
    remove(id: string, fields: SubscriptionSelection, targets: SubscriptionSpec[], variables: {}, visited?: string[]): void;
    private removeSubscribers;
    removeAllSubscribers(id: string, targets?: SubscriptionSpec[], visited?: string[]): void;
}
