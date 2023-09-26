import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { navigationItemStyles } from './navigation-item.styles';

export class NavigationItemComponent extends LitElement {
  static styles = [navigationItemStyles];

  @property() icon?: string;

  connectedCallback(): void {
    super.connectedCallback();

    const parent = this.parentNode as Element;
    const mutationObserver = new MutationObserver(() => {
      if (parent.hasAttribute('collapsed')) {
        this.setAttribute('parent-collapsed', '');
      } else {
        this.removeAttribute('parent-collapsed');
      }
    });

    mutationObserver.observe(parent, { attributes: true });

    if (parent.hasAttribute('collapsed')) {
      this.setAttribute('parent-collapsed', '');
    }
  }

  render(): TemplateResult {
    return html`
      <slot name="icon">
        ${this.icon ? html`<oryx-icon .type=${this.icon}></oryx-icon>` : html``}
      </slot>
      <slot class="text"></slot>
    `;
  }
}
