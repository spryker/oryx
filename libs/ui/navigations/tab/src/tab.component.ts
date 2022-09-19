import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property } from 'lit/decorators.js';
import { tabStyles } from './tab.styles';

export class TabComponent extends LitElement {
  static styles = tabStyles;

  @property() for?: string;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) error = false;

  render(): TemplateResult {
    return html`${when(
        this.error,
        () => html` <oryx-icon type="error"></oryx-icon>`
      )} <slot></slot>`;
  }
}
