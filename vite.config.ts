import adapter from '@sveltejs/adapter-static';
import {sveltekit} from '@sveltejs/kit/vite';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import {defineConfig} from 'vite';
const base=process.env.SITE_BASE_PATH||'';
export default defineConfig({define:{__SITE_BASE__:JSON.stringify(base)},plugins:[sveltekit({preprocess:vitePreprocess(),adapter:adapter({pages:'dist',assets:'dist',strict:true}),files:{assets:'public'},paths:{base:base as ''|`/${string}`},prerender:{entries:['*']}})],server:{host:'0.0.0.0',port:4180,strictPort:true}});
