import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { CollapseToggleController } from './navigation-collapse.controller';
import { navigationStyles } from './navigation.styles';

export class NavigationComponent extends LitElement {
  static styles = [navigationStyles];

  /**
   * Label that is used for assistive technology to vocalise the usage
   * of the collapse button.
   *
   * Defaults to "collapse navigation".
   */
  @property()
  toggleButtonAriaLabel?: string = 'collapse navigation';

  protected collapse = new CollapseToggleController(this);

  render(): TemplateResult {
    return html`
      <oryx-image resource="logo"></oryx-image>
      <slot></slot>
      <button @click=${this.toggle} aria-label=${this.toggleButtonAriaLabel}>
        <oryx-icon type="back" size="md"></oryx-icon>
      </button>
    `;
  }

  protected toggle(): void {
    this.collapse.toggle();
  }
}
