import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { html, LitElement, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ContentTextContent, ContentTextOptions } from './text.model';
import { contentTextStyles } from './text.styles';

@defaultOptions({ autoInstallFont: true })
export class ContentTextComponent extends ContentMixin<
  ContentTextOptions,
  ContentTextContent
>(LitElement) {
  static styles = contentTextStyles;

  // protected textController = new TextController(this);

  protected override render(): TemplateResult | void {
    const { tag } = this.$options();
    const { text } = this.$content();
    if (this.isHeading())
      return html`??${unsafeHTML(`<${tag}>${text}</${tag}>`)}`;
    return html`!!${unsafeHTML(text)}`;
  }

  protected isHeading(): boolean {
    const { tag } = this.$options();
    return !!tag && !['button', 'subtitle', 'caption', 'small'].includes(tag);
  }
}
