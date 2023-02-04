import { json } from '@sveltejs/kit';
import { schema } from './schema';
import { createSchema } from 'graphql-yoga';
import * as graphql from 'graphql';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { query, variables } = await request.json();

	return json(
		await graphql.execute({
			schema,
			document: graphql.parse(query)
		})
	);
}
