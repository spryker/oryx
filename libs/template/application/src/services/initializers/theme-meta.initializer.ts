import { AppInitializer, PageMetaService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';

export const ThemeMetaInitializer = `${AppInitializer}ThemeMeta`;

export class DefaultThemeMetaInitializer implements AppInitializer {
  constructor(protected metaService = inject(PageMetaService, null)) {}

  initialize(): void {
    this.metaService?.add([
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
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap',
        },
      },
      {
        name: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap',
          media: 'all',
        },
      },
      {
        name: 'style',
        attrs: {
          text: ':root{font-size: 14px}body {margin: 0;}',
        },
      },
    ]);
  }
}
