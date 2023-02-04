// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import houdini from 'houdini/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [houdini(), sveltekit()]
};

export default config;
