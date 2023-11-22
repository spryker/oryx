import { ButtonColor, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { CollapseToggleController } from './navigation-collapse.controller';
import { navigationStyles } from './navigation.styles';

export class NavigationComponent extends LitElement {
  static styles = [navigationStyles];

  /**
   * Label that is used for assistive technology to vocalize the usage
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
      <oryx-button
        .type=${ButtonType.Icon}
        .size=${Size.Sm}
        .color=${ButtonColor.Neutral}
        .label=${this.toggleButtonAriaLabel}
        .icon=${IconTypes.Backward}
        @click=${this.toggle}
      ></oryx-button>
    `;
  }

  protected toggle(): void {
    this.collapse.toggle();
  }
}
