import { PageMetaService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixinInterface } from '@spryker-oryx/experience';
import { effect } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import { ContentTextContent, ContentTextOptions } from './text.model';

export class TextController implements ReactiveController {
  protected pageMetaService = resolve(PageMetaService);

  constructor(
    protected host: LitElement &
      ContentMixinInterface<ContentTextOptions, ContentTextContent>
  ) {
    this.host.addController(this);
  }

  hostConnected?(): void;

  protected setTypography = effect(() => {
    const { font, autoInstallFont, size, color, lineHeight, tag } =
      this.host.$options();
    let style = ''; //this.host.getAttribute('style') ?? '';

    if (font) {
      style += this.getRule('font-family', `'${font}', sans-serif`);

      if (autoInstallFont) {
        this.pageMetaService.add({
          name: 'link',
          attrs: {
            rel: 'stylesheet',
            href: `https://fonts.googleapis.com/css2?family=${font}:wght@400;500;600;700&display=swap`,
          },
        });
      }
    }
    style += this.getRule('font-size', size);
    style += this.getRule('line-height', lineHeight);
    style += this.getRule('color', color ?? 'inherit');

    if (tag) {
      style += `font-size: var(--oryx-typography-${tag}-size);`;
      style += `font-weight: var(--oryx-typography-${tag}-weight);`;
      style += `line-height: var(--oryx-typography-${tag}-line);`;
      style += 'margin: 0;';
    }

    this.host.setAttribute('style', style);
  });

  protected getRule(key: string, value?: string): string {
    if (!value) return '';
    return `${key}:${value};`;
  }
}
