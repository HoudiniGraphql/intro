import { executeQuery } from './network';
import cache from './cache';
import { marshalInputs, marshalSelection, unmarshalSelection } from './scalars';
// @ts-ignore: this file will get generated and does not exist in the source code
import { getSession } from './adapter.mjs';
// mutation returns a handler that will send the mutation to the server when
// invoked
export function mutation(document) {
    // make sure we got a query document
    if (document.kind !== 'HoudiniMutation') {
        throw new Error('mutation() must be passed a mutation document');
    }
    // we might get re-exported values nested under default
    // @ts-ignore: typing esm/cjs interop is hard
    const artifact = document.artifact.default || document.artifact;
    // @ts-ignore: typing esm/cjs interop is hard
    const config = document.config.default || document.config;
    // grab the session from the adapter
    const sessionStore = getSession();
    // return an async function that sends the mutation go the server
    return async (variables, mutationConfig) => {
        // treat a mutation like it has an optimistic layer regardless of
        // whether there actually _is_ one. This ensures that a query which fires
        // after this mutation has been sent will overwrite any return values from the mutation
        //
        // as far as I can tell, this is an arbitrary decision but it does give a
        // well-defined ordering to a subtle situation so that seems like a win
        //
        const layer = cache._internal_unstable.storage.createLayer(true);
        // if there is an optimistic response then we need to write the value immediately
        const optimisticResponse = mutationConfig === null || mutationConfig === void 0 ? void 0 : mutationConfig.optimisticResponse;
        // hold onto the list of subscribers that we updated because of the optimistic response
        // and make sure they are included in the final set of subscribers to notify
        let toNotify = [];
        if (optimisticResponse) {
            toNotify = cache.write({
                selection: artifact.selection,
                // make sure that any scalar values get processed into something we can cache
                data: marshalSelection({
                    config,
                    selection: artifact.selection,
                    data: optimisticResponse,
                }),
                variables,
                layer: layer.id,
            });
        }
        try {
            // trigger the mutation on the server
            const { result } = await executeQuery(artifact, marshalInputs({
                input: variables,
                artifact: document.artifact,
                config: config,
            }), sessionStore, false);
            // clear the layer holding any mutation results
            layer.clear();
            // write the result of the mutation to the cache
            cache.write({
                selection: artifact.selection,
                data: result.data,
                variables,
                // write to the mutation's layer
                layer: layer.id,
                // notify any subscribers that we updated with the optimistic response
                // in order to address situations where the optimistic update was wrong
                notifySubscribers: toNotify,
                // make sure that we notify subscribers for any values that we overwrite
                // in order to address any race conditions when comparing the previous value
                forceNotify: true,
            });
            // merge the layer back into the cache
            cache._internal_unstable.storage.resolveLayer(layer.id);
            // turn any scalars in the response into their complex form
            return unmarshalSelection(config, artifact.selection, result.data);
        }
        catch (error) {
            // if the mutation failed, roll the layer back and delete it
            layer.clear();
            cache._internal_unstable.storage.resolveLayer(layer.id);
            // bubble the mutation error up to the caller
            throw error;
        }
    };
}
