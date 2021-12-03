import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './oryx-icon.styles';

@customElement('oryx-icon')
export class IconComponent extends LitElement {
  static styles = styles;

  @property() type: string | undefined;

  render(): TemplateResult {
    if (!this.type) {
      return html``;
    }
    return html`
      <svg viewBox="0 0 24 24">
        <use href="assets/icons.svg#${this.type}" />
      </svg>
    `;
  }
}
