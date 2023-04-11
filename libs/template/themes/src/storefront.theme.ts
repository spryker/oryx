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
        href: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABzElEQVR42mIYNiApKYENUG09wMgVhQEU7hi1bdu2bdtuwzqobdtt1AZFtEawiBYx1hsny3hxkox9M39GyTeeeefxXlijGWDGiGgGaLEEerE/7d27p0YxYie6SQa0VwzYjmmSAW2gUwg4hL2SAf3QSiHgCG5JBvRGT8WAt5IBXTBRMeAbtFIBZqyERiEgEWbJrbAabUMMOIsMWCUDlmNiiBeiL0iXDhiLAyEEdEAu/sPEbwxojfYwhBPQDldgDRIwB9X42KdPr7V8/zeScQ29wgnQ4DwmBli4Do/RtH//3nd89zOKcQytJXbDOlyCxk/ARJShac+eXXf43gPMhtjp2B1HYPaxcAu+ohGV+/btWcP3OkoehN1wHKcxExqPgEUoZNM/X7586boJE8bZNrnsaZiJX8jHaNfP2eRT5s2bs6Vv3953bbvJKB2gRTeswQts8Bgtr6EExZ5x0iEabMFHDLO9NxXVaMLrkIZugdExG2dtr2ejHnVYIrCIkCL24jN0LgH56BKpgC54gdYYhkr8hC5SARrsQS9Y8RdqsyCBiP7oYHu+FbsjHaDtDZdTsV+kAzQYDhMWY3lEA2wRfTAfRzEk4gG2CAtatYjnWzMHv6UnW2fOxQAAAABJRU5ErkJggg==',
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
