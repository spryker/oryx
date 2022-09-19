import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { tabPanelStyles } from './tab-panel.styles';

export class TabPanelComponent extends LitElement {
  static styles = tabPanelStyles;

  @property({ type: Boolean, reflect: true }) selected = false;

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
