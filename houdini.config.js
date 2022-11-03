/** @type {import('houdini').ConfigFile} */
const config = {
	apiUrl: 'http://localhost:4000',
	plugins: {
		'houdini-svelte': {
			client: './src/client.js'
		}
	}
};

export default config;
