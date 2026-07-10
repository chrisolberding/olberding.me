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
    // Research moved to its own subdomain.
    '/research': 'https://research.olberding.me/',
    '/research/aeo-measurement-standard': 'https://research.olberding.me/aeo-measurement-standard',
    '/research/seo-keyword-portfolio-audit': 'https://research.olberding.me/seo-keyword-portfolio-audit',
  },
});