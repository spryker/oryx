import { Theme } from '@spryker-oryx/core';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';
import { storefrontIcons } from '@spryker-oryx/themes/icons';

export const storefrontTheme: Theme = {
  name: 'storefront',
  breakpoints: defaultBreakpoints,
  icons: storefrontIcons,
  designTokens: () =>
    import('../design-tokens/src/storefront').then((s) => s.storefrontTokens),
  head: [
    {
      name: 'html',
      attrs: {
        lang: 'en',
      },
    },
    {
      name: 'meta',
      attrs: {
        charset: 'UTF-8',
      },
    },
    {
      name: 'meta',
      attrs: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
    },
    {
      name: 'link',
      attrs: {
        rel: 'icon',
        href: './favicon.png',
        sizes: '32x32',
      },
    },
    {
      name: 'link',
      attrs: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap',
      },
    },
    {
      name: 'title',
      attrs: {
        text: 'Composable Storefront',
      },
    },
  ],
};
