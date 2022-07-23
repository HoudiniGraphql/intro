// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { replaceCodePlugin } from 'vite-plugin-replace';
import watchAndRun from '@kitql/vite-plugin-watch-and-run';

/** @type {import('vite').UserConfig} */
const config = {
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
        sveltekit(),
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
        }),
        watchAndRun([
            {
                name: 'Houdini',
                watch: path.resolve('src/**/*.(gql|graphql|svelte)'),
                run: 'npm run generate',
                delay: 100,
                watchKind: ['ready', 'add', 'change', 'unlink'],
            },
            {
                name: 'Houdini',
                watch: path.resolve('houdini.config.js'),
                run: 'npm run generate',
                delay: 100,
            },
        ])
    ]
};

export default config;
