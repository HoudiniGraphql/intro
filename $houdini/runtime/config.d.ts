import { CachePolicy } from './types';
export declare type ScalarSpec = {
    type: string;
    marshal: (val: any) => any;
    unmarshal: (val: any) => any;
};
declare type ScalarMap = {
    [typeName: string]: ScalarSpec;
};
export declare type ConfigFile = {
    sourceGlob: string;
    schemaPath?: string;
    schema?: string;
    quiet?: boolean;
    apiUrl?: string;
    static?: boolean;
    scalars?: ScalarMap;
    definitionsPath?: string;
    framework?: 'kit' | 'sapper' | 'svelte';
    module?: 'esm' | 'commonjs';
    cacheBufferSize?: number;
    defaultCachePolicy?: CachePolicy;
    defaultPartial?: boolean;
    defaultKeys?: string[];
    types?: TypeConfig;
};
export declare type TypeConfig = {
    [typeName: string]: {
        keys?: string[];
        resolve: {
            queryField: string;
            arguments?: (data: any) => {
                [key: string]: any;
            };
        };
    };
};
export declare function defaultConfigValues(file: ConfigFile): ConfigFile;
export declare function keyFieldsForType(configFile: ConfigFile, type: string): string[];
export declare function computeID(configFile: ConfigFile, type: string, data: any): string;
export {};
