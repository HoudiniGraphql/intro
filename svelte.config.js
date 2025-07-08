import adapter from '@sveltejs/adapter-auto'
import path from 'path'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			// these are the aliases and paths to them
			'~': path.resolve('./src'),
			$houdini: path.resolve('./$houdini')
		}
	}
}

export default config
