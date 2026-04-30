// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://olberding.me',
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.includes('/projects/') })],
  redirects: {
    '/blog/when-it-all-goes-to-shit': '/blog/when-it-all-goes-to-hell',
  },
});