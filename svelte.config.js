import adapter from '@sveltejs/adapter-auto';
import houdini from 'houdini/preprocess';
import path from 'path';
import { replaceCodePlugin } from 'vite-plugin-replace';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [houdini()],

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					// these are the aliases and paths to them
					'~': path.resolve('./src'),
					$houdini: path.resolve('.', '$houdini')
				}
			},
			server: {
				fs: {
					allow: ['.']
				}
			},
			plugins: [
				replaceCodePlugin({
					replacements: [
						{
							from: 'API_URL',
							to: JSON.stringify(process.env.API_URL || 'http://localhost:4000/graphql')
						},
						{
							from: 'WS_URL',
							to: JSON.stringify(process.env.WS_URL || 'ws://localhost:4000/graphql')
						}
					]
				})
			]
		}
	}
};

export default config;
