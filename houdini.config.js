/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
	url: '/graphql',
	schemaPath: './src/routes/graphql/schema.graphql',
	include: 'src/**/*.{svelte,gql,js}',
	exclude: 'src/routes/graphql/schema.graphql',
	plugins: {
		'houdini-svelte': {}
	}
}

export default config
