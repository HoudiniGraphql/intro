import { Readable } from 'svelte/store';
import type { ConfigFile } from './config';
import { Operation, GraphQLTagResult, QueryArtifact, GraphQLObject, DataSource } from './types';
import { RequestPayload } from './network';
import type { FetchQueryResult } from './network';
export declare function query<_Query extends Operation<any, any>>(document: GraphQLTagResult): QueryResponse<_Query['result'], _Query['input']>;
export declare type QueryResponse<_Data, _Input> = {
    data: Readable<_Data>;
    writeData: (data: RequestPayload<_Data>, variables: _Input) => void;
    onLoad: (newValue: FetchQueryResult<_Data> & {
        variables: _Input;
    }) => void;
    refetch: (newVariables?: _Input) => Promise<void>;
    loading: Readable<boolean>;
    partial: Readable<boolean>;
    error: Readable<Error | null>;
};
export declare const routeQuery: <_Data, _Input>({ queryHandler, artifact, source, }: {
    queryHandler: QueryResponse<_Data, _Input>;
    artifact: QueryArtifact;
    source: DataSource;
}) => QueryResponse<_Data, _Input>;
export declare const componentQuery: <_Data extends GraphQLObject, _Input>({ config, artifact, queryHandler, variableFunction, getProps, }: {
    config: ConfigFile;
    artifact: QueryArtifact;
    queryHandler: QueryResponse<_Data, _Input>;
    variableFunction: (...args: any[]) => _Input;
    getProps: () => any;
}) => QueryResponse<_Data, _Input>;
