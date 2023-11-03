import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { RichTextController } from './richtext.controller';
import { TextProperties } from './text.model';
import { textStyles } from './text.styles';

export class TextComponent extends LitElement implements TextProperties {
  static styles = textStyles;

  @property() content?: string;

  protected controller = new RichTextController(this);

  protected render(): TemplateResult | void {
    return html`${this.controller.richContent}`;
  }
}
