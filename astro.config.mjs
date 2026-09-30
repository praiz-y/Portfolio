// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// TODO: swap for the real custom domain before launch.
export const SITE = 'https://praiseoga.com';

export default defineConfig({
  site: SITE,
  integrations: [icon()],
  build: {
    // Small stylesheets get inlined, larger ones stay external — avoids both
    // a render-blocking request and a flash of unstyled text on small pages.
    inlineStylesheets: 'auto',
  },
});
