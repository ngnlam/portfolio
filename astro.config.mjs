// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://leolamnguyen.netlify.app',
  // Clean URLs without a trailing slash: /about, /work/zalo-showroom.
  // `file` builds about.html, which Netlify serves at /about with no redirect.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
