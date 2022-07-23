import adapter from '@sveltejs/adapter-auto';
import houdini from 'houdini-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [houdini()],

	kit: {
		adapter: adapter(),
	}
};

export default config;
