import { sveltekit } from '@sveltejs/kit/vite';
import houdini from 'houdini/vite';
import path from 'path';

export default {
	plugins: [houdini(), sveltekit()]
};
