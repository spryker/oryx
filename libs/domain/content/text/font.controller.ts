import { PageMetaService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixinInterface } from '@spryker-oryx/experience';
import { effect } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import { ContentTextContent, ContentTextOptions } from './text.model';

export class FontController implements ReactiveController {
  protected pageMetaService = resolve(PageMetaService);

  constructor(
    protected host: LitElement &
      ContentMixinInterface<ContentTextOptions, ContentTextContent>
  ) {
    this.host.addController(this);
  }

  hostConnected(): void {
    this.fontInstallEffect.start();
  }

  hostDisconnected(): void {
    this.fontInstallEffect.stop();
  }

  protected fontInstallEffect = effect(
    () => {
      if (this.host.$options()?.autoInstallFont) {
        this.collectFonts().forEach((font) => {
          this.pageMetaService.add({
            name: 'link',
            attrs: {
              rel: 'stylesheet',
              href: `https://fonts.googleapis.com/css2?family=${font}:wght@400;500;600;700&display=swap`,
            },
          });
        });
      }
    },
    { defer: true }
  );

  protected collectFonts(): string[] {
    const text = this.host.$content()?.text;
    if (!text) return [];

    const fontsSet = new Set<string>();
    const regex = /font-family:'(.*?)'/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      fontsSet.add(match[1]);
    }

    const fonts = Array.from(fontsSet);
    return fonts;
  }
}
