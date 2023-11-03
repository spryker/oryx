import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { elementEffect } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { FontService } from '../src/services/';
import { ContentTextContent, ContentTextOptions } from './text.model';
import { contentTextStyles } from './text.styles';

@defaultOptions({ autoInstallFont: true })
export class ContentTextComponent extends ContentMixin<
  ContentTextOptions,
  ContentTextContent
>(LitElement) {
  static styles = contentTextStyles;

  protected fontService = resolve(FontService);

  @elementEffect()
  protected installFonts = (): void => {
    const text = this.$content()?.text;
    if (text && this.$options().autoInstallFont) this.fontService.install(text);
  };

  protected override render(): TemplateResult | void {
    const text = this.$content()?.text;
    if (!text) return;
    return html`<oryx-text .content=${text}></oryx-text>`;
  }
}
