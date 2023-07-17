import { PageMetaService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { FontService } from './fonts.service';

export class DefaultFontService implements FontService {
  constructor(protected pageMetaService = inject(PageMetaService)) {}

  install(text: string): void {
    this.collectFonts(text).forEach((font) => {
      this.pageMetaService.add([
        {
          name: 'link',
          attrs: {
            rel: 'preload',
            href: `https://fonts.googleapis.com/css2?family=${font}:wght@400;500;600;700&display=swap`,
          },
        },
        {
          name: 'link',
          attrs: {
            rel: 'stylesheet',
            href: `https://fonts.googleapis.com/css2?family=${font}:wght@400;500;600;700&display=swap`,
            media: 'all',
          },
        },
      ]);
    });
  }

  protected collectFonts(text: string): string[] {
    const fontsSet = new Set<string>();
    const regex = /font(-family)?\s*:\s*[^'"]*['|"](.*?)['|"]/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      fontsSet.add(match[2]);
    }

    const fonts = Array.from(fontsSet);
    return fonts;
  }
}
