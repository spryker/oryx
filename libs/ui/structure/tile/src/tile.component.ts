import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { tileStyles } from './tile.styles';

export class TileComponent extends LitElement {
  static styles = tileStyles;

  @property({ type: Boolean, reflect: true }) selected?: boolean;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
