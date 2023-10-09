import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { navigationItemStyles } from './navigation-item.styles';

export class NavigationItemComponent extends LitElement {
  static styles = [navigationItemStyles];

  @property() icon?: string;

  render(): TemplateResult {
    return html`
      <slot name="icon">
        ${this.icon ? html`<oryx-icon .type=${this.icon}></oryx-icon>` : html``}
      </slot>
      <slot class="text"></slot>
    `;
  }
}
