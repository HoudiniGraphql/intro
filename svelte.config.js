import adapter from '@sveltejs/adapter-auto'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
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
