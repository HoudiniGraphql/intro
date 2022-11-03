import { HoudiniClient } from '$houdini';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { browser } from '$app/environment';

// this function can take a second argument that will contain the session
// data during a request or mutation
async function fetchQuery({ text, fetch, variables = {} }) {
	const result = await fetch('http://localhost:4000/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});

	// parse the result as json
	return await result.json();
}

export default new HoudiniClient(fetchQuery);
