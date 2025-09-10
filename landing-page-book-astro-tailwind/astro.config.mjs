import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
	integrations: [sitemap(), partytown()],
	output: 'static', // Changed from 'server' to 'static' for Docker deployment
	vite: {
		plugins: [tailwindcss()],
	},
});
