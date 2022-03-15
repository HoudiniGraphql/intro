import adapter from '@sveltejs/adapter-auto';
import houdini from 'houdini-preprocess';
import path from 'path';

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
			}
		}
	}
};

export default config;
