// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://opensearch-agentops.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Minimize JavaScript bundle size with esbuild (built-in, faster)
      minify: 'esbuild',
      cssMinify: true,
    },
  },
  build: {
    // Inline small assets to reduce HTTP requests
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});