import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { TabProperties } from './tab.model';
import { tabStyles } from './tab.styles';

export class TabComponent extends LitElement implements TabProperties {
  static styles = tabStyles;

  @property() for?: string;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) error = false;

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
