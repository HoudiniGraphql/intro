import { sveltekit } from '@sveltejs/kit/vite'
import houdini from 'houdini/vite'

export default {
	plugins: [houdini(), sveltekit()]
}
