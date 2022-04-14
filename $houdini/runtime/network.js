// externals
import { get } from 'svelte/store';
import { CachePolicy, DataSource, } from './types';
import { marshalInputs } from './scalars';
import cache from './cache';
export class Environment {
    constructor(networkFn, subscriptionHandler) {
        this.fetch = networkFn;
        this.socket = subscriptionHandler;
    }
    sendRequest(ctx, params, session) {
        return this.fetch.call(ctx, params, session);
    }
}
let currentEnv = null;
export function setEnvironment(env) {
    currentEnv = env;
}
export function getEnvironment() {
    return currentEnv;
}
// This function is responsible for simulating the fetch context, getting the current session and executing the fetchQuery.
// It is mainly used for mutations, refetch and possible other client side operations in the future.
export async function executeQuery(artifact, variables, sessionStore, cached) {
    // We use get from svelte/store here to subscribe to the current value and unsubscribe after.
    // Maybe there can be a better solution and subscribing only once?
    const session = get(sessionStore);
    // Simulate the fetch/load context
    const fetchCtx = {
        fetch: window.fetch.bind(window),
        session,
        stuff: {},
        page: {
            host: '',
            path: '',
            params: {},
            query: new URLSearchParams(),
        },
    };
    const { result: res, partial } = await fetchQuery({
        context: fetchCtx,
        artifact,
        session,
        variables,
        cached,
    });
    // we could have gotten a null response
    if (res.errors && res.errors.length > 0) {
        throw res.errors;
    }
    if (!res.data) {
        throw new Error('Encountered empty data response in payload');
    }
    return { result: res, partial };
}
// convertKitPayload is responsible for taking the result of kit's load
export async function convertKitPayload(context, loader, page, session) {
    // invoke the loader
    const result = await loader({
        page,
        session,
        stuff: {},
        fetch: context.fetch,
    });
    // if the response contains an error
    if (result.error) {
        // 500 - internal server error
        context.error(result.status || 500, result.error);
        return;
    }
    // if the response contains a redirect
    if (result.redirect) {
        // 307 - temporary redirect
        context.redirect(result.status || 307, result.redirect);
        return;
    }
    // the response contains data!
    if (result.props) {
        return result.props;
    }
    // we shouldn't get here
    throw new Error('Could not handle response from loader: ' + JSON.stringify(result));
}
export async function fetchQuery({ context, artifact, variables, session, cached = true, }) {
    // grab the current environment
    const environment = getEnvironment();
    // if there is no environment
    if (!environment) {
        return {
            result: { data: {}, errors: [{ message: 'could not find houdini environment' }] },
            source: null,
            partial: false,
        };
    }
    // enforce cache policies for queries
    if (cached && artifact.kind === 'HoudiniQuery') {
        // tick the garbage collector asynchronously
        setTimeout(() => {
            cache._internal_unstable.collectGarbage();
        }, 0);
        // this function is called as the first step in requesting data. If the policy prefers
        // cached data, we need to load data from the cache (if its available). If the policy
        // prefers network data we need to send a request (the onLoad of the component will
        // resolve the next data)
        // if the cache policy allows for cached data, look at the caches value first
        if (artifact.policy !== CachePolicy.NetworkOnly) {
            // look up the current value in the cache
            const value = cache.read({ selection: artifact.selection, variables });
            // if the result is partial and we dont allow it, dont return the value
            const allowed = !value.partial || artifact.partial;
            // if we have data, use that unless its partial data and we dont allow that
            if (value.data !== null && allowed) {
                return {
                    result: {
                        data: value.data,
                        errors: [],
                    },
                    source: DataSource.Cache,
                    partial: value.partial,
                };
            }
            // if the policy is cacheOnly and we got this far, we need to return null (no network request will be sent)
            else if (artifact.policy === CachePolicy.CacheOnly) {
                return {
                    result: {
                        data: null,
                        errors: [],
                    },
                    source: DataSource.Cache,
                    partial: false,
                };
            }
        }
    }
    // the request must be resolved against the network
    return {
        result: await environment.sendRequest(context, { text: artifact.raw, hash: artifact.hash, variables }, session),
        source: DataSource.Network,
        partial: false,
    };
}
export class RequestContext {
    constructor(ctx) {
        this.continue = true;
        this.returnValue = {};
        this.context = ctx;
    }
    error(status, message) {
        this.continue = false;
        this.returnValue = {
            error: message,
            status,
        };
    }
    redirect(status, location) {
        this.continue = false;
        this.returnValue = {
            redirect: location,
            status,
        };
    }
    fetch(input, init) {
        // make sure to bind the window object to the fetch in a browser
        const fetch = typeof window !== 'undefined' ? this.context.fetch.bind(window) : this.context.fetch;
        return fetch(input, init);
    }
    graphqlErrors(payload) {
        // if we have a list of errors
        if (payload.errors) {
            return this.error(500, payload.errors.map(({ message }) => message).join('\n'));
        }
        return this.error(500, 'Encountered invalid response: ' + JSON.stringify(payload));
    }
    // This hook fires before executing any queries, it allows to redirect/error based on session state for example
    // It also allows to return custom props that should be returned from the corresponding load function.
    async invokeLoadHook({ variant, framework, hookFn, data, }) {
        // call the onLoad function to match the framework
        let hookCall;
        if (framework === 'kit') {
            if (variant === 'before') {
                hookCall = hookFn.call(this, this.context);
            }
            else {
                hookCall = hookFn.call(this, {
                    ...this.context,
                    data,
                });
            }
        }
        else {
            // sapper
            if (variant === 'before') {
                hookCall = hookFn.call(this, this.context.page, this.context.session);
            }
            else {
                hookCall = hookFn.call(this, this.context.page, this.context.session, data);
            }
        }
        let result = await hookCall;
        // If the returnValue is already set through this.error or this.redirect return early
        if (!this.continue) {
            return;
        }
        // If the result is null or undefined, or the result isn't an object return early
        if (result == null || typeof result !== 'object') {
            return;
        }
        this.returnValue = result;
    }
    // compute the inputs for an operation should reflect the framework's conventions.
    // in sapper, this means preparing a `this` for the function. for kit, we can just pass
    // the context
    computeInput({ config, framework, variableFunction, artifact, }) {
        // call the variable function to match the framework
        let input = framework === 'kit'
            ? // in kit just pass the context directly
                variableFunction.call(this, this.context)
            : // we are in sapper mode, so we need to prepare the function context
                variableFunction.call(this, this.context.page, this.context.session);
        // and pass page and session
        return marshalInputs({ artifact, config, input });
    }
}
