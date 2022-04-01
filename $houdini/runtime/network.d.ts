import { Readable } from 'svelte/store';
import type { Config } from 'houdini-common';
import { DataSource, GraphQLObject, MutationArtifact, QueryArtifact, SubscriptionArtifact } from './types';
export declare class Environment {
    private fetch;
    socket: SubscriptionHandler | null | undefined;
    constructor(networkFn: RequestHandler<any>, subscriptionHandler?: SubscriptionHandler | null);
    sendRequest<_Data>(ctx: FetchContext, params: FetchParams, session?: FetchSession): any;
}
export declare function setEnvironment(env: Environment): void;
export declare function getEnvironment(): Environment | null;
export declare type SubscriptionHandler = {
    subscribe: (payload: {
        query: string;
        variables?: {};
    }, handlers: {
        next: (payload: {
            data?: {};
            errors?: readonly {
                message: string;
            }[];
        }) => void;
        error: (data: {}) => void;
        complete: () => void;
    }) => () => void;
};
export declare type FetchParams = {
    text: string;
    hash: string;
    variables: {
        [key: string]: any;
    };
};
export declare type FetchContext = {
    page: {
        host: string;
        path: string;
        params: Record<string, string | string[]>;
        query: URLSearchParams;
    };
    fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>;
    session: any;
    stuff: Record<string, any>;
};
export declare type BeforeLoadContext = FetchContext;
export declare type AfterLoadContext = FetchContext & {
    data: Record<string, any>;
};
export declare type KitLoadResponse = {
    status?: number;
    error?: Error;
    redirect?: string;
    props?: Record<string, any>;
    context?: Record<string, any>;
    maxage?: number;
};
export declare type FetchSession = any;
declare type GraphQLError = {
    message: string;
};
export declare type RequestPayload<_Data = any> = {
    data: _Data;
    errors: {
        message: string;
    }[];
};
export declare type RequestHandler<_Data> = (this: FetchContext, params: FetchParams, session?: FetchSession) => Promise<RequestPayload<_Data>>;
export declare function executeQuery<_Data extends GraphQLObject, _Input>(artifact: QueryArtifact | MutationArtifact, variables: _Input, sessionStore: Readable<any>, cached: boolean): Promise<{
    result: RequestPayload;
    partial: boolean;
}>;
export declare function convertKitPayload(context: RequestContext, loader: (ctx: FetchContext) => Promise<KitLoadResponse>, page: FetchContext['page'], session: FetchContext['session']): Promise<Record<string, any>>;
export declare type FetchQueryResult<_Data> = {
    result: RequestPayload<_Data | {} | null>;
    source: DataSource | null;
    partial: boolean;
};
export declare type QueryInputs<_Data> = FetchQueryResult<_Data> & {
    variables: {
        [key: string]: any;
    };
};
export declare function fetchQuery<_Data extends GraphQLObject>({ context, artifact, variables, session, cached, }: {
    context: FetchContext;
    artifact: QueryArtifact | MutationArtifact;
    variables: {};
    session?: FetchSession;
    cached?: boolean;
}): Promise<FetchQueryResult<_Data>>;
export declare class RequestContext {
    context: FetchContext;
    continue: boolean;
    returnValue: {};
    constructor(ctx: FetchContext);
    error(status: number, message: string | Error): any;
    redirect(status: number, location: string): any;
    fetch(input: RequestInfo, init?: RequestInit): any;
    graphqlErrors(payload: {
        errors?: GraphQLError[];
    }): any;
    invokeLoadHook({ variant, framework, hookFn, data, }: {
        variant: 'before' | 'after';
        framework: 'kit' | 'sapper';
        hookFn: KitBeforeLoad | KitAfterLoad | SapperBeforeLoad | SapperAfterLoad;
        data: Record<string, any>;
    }): Promise<void>;
    computeInput({ config, framework, variableFunction, artifact, }: {
        framework: 'kit' | 'sapper';
        variableFunction: SapperBeforeLoad | KitBeforeLoad;
        artifact: QueryArtifact | MutationArtifact | SubscriptionArtifact;
        config: Config;
    }): {};
}
declare type SapperBeforeLoad = (page: FetchContext['page'], session: FetchContext['session']) => Record<string, any>;
declare type SapperAfterLoad = (page: FetchContext['page'], session: FetchContext['session'], data: Record<string, any>) => Record<string, any>;
declare type KitBeforeLoad = (ctx: BeforeLoadContext) => Record<string, any>;
declare type KitAfterLoad = (ctx: AfterLoadContext) => Record<string, any>;
export {};
