import { createYoga } from 'graphql-yoga';
import { schema } from './schema.js';

const yoga = createYoga({
	schema,
	graphiql: {}
});

self.addEventListener('fetch', yoga);
