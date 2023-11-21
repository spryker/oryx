import { AppInitializer, PageMetaService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';

export class PWAThemeMetaInitializer implements AppInitializer {
  constructor(protected metaService = inject(PageMetaService, null)) {}

  initialize(): void {
    this.metaService?.add([
      {
        name: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
          media: 'all',
        },
      },
      {
        name: 'style',
        attrs: {
          text: ':root{font-size: 16px}body {margin: 0;}',
        },
      },
      {
        name: 'link',
        attrs: {
          rel: 'icon',
          type: 'image/png',
          href: '/icons/favicon-16x16.png',
          sizes: '16x16',
        },
      },
      {
        name: 'link',
        attrs: {
          rel: 'icon',
          type: 'image/png',
          href: '/icons/favicon-32x32.png',
          sizes: '32x32',
        },
      },
      {
        name: 'link',
        attrs: {
          rel: 'mask-icon',
          href: '/icons/safari-pinned-tab.svg',
          color: 'ffffff',
        },
      },
      {
        name: 'link',
        attrs: {
          rel: 'icon',
          href: '/favicon.ico',
          type: 'image/x-icon',
        },
      },
      {
        name: 'link',
        attrs: {
          rel: 'apple-touch-icon',
          href: '/icons/apple-touch-icon-180x180.png',
          sizes: '180x180',
        },
      },
    ]);
  }
}
