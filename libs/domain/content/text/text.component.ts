import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { html, LitElement, TemplateResult } from 'lit';
import { FontController } from './font.controller';
import { ContentTextContent, ContentTextOptions } from './text.model';
import { contentTextStyles } from './text.styles';

@defaultOptions({ autoInstallFont: true })
export class ContentTextComponent extends ContentMixin<
  ContentTextOptions,
  ContentTextContent
>(LitElement) {
  static styles = contentTextStyles;

  protected fontController = new FontController(this);

  protected override render(): TemplateResult | void {
    const text = this.$content()?.text;
    if (!text) return;
    return html`<oryx-text .content=${text}></oryx-text>`;
  }
}
