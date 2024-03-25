import {vitePreprocess} from '@sveltejs/vite-plugin-svelte'
import adapter from 'sveltekit-adapter-chrome-extension';

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  adapter: adapter(),
  appDir: "app"
}
