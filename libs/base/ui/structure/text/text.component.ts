import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';

export class TextComponent extends LitElement {
  protected override render(): TemplateResult {
    return html`<slot></slot> `;
  }
}
