import { Operation, GraphQLTagResult } from './types';
export declare type MutationConfig<_Mutation extends Operation<any, any>> = {
    optimisticResponse: _Mutation['result'];
};
export declare function mutation<_Mutation extends Operation<any, any>>(document: GraphQLTagResult): (_input: _Mutation['input'], config?: MutationConfig<_Mutation>) => Promise<_Mutation['result']>;
