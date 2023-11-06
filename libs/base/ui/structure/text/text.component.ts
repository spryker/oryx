import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { TextProperties } from './text.model';
import { textStyles } from './text.styles';

export class TextComponent extends LitElement implements TextProperties {
  static styles = textStyles;

  @property() content?: string;

  protected render(): TemplateResult | void {
    if (!this.content) {
      return;
    }
    return html`${unsafeHTML(this.content)}`;
  }
}
