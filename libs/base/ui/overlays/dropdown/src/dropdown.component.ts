import { ButtonColor, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { PopoverController } from '@spryker-oryx/ui/popover';
import { Size, hydrate, queryFirstFocusable } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { DropdownProperties, Position } from './dropdown.model';
import { dropdownBaseStyles } from './styles';

@hydrate({ event: ['mouseover', 'focusin'] })
export class DropdownComponent
  extends LitElement
  implements DropdownProperties
{
  static styles = dropdownBaseStyles;
  protected controller = new PopoverController(this, {
    boundingElement: this,
  });

  @property({ reflect: true, type: Boolean }) open = false;
  @property() position?: Position;
  @property({ type: Boolean, attribute: 'vertical-align' })
  verticalAlign?: boolean;
  @property() triggerIconSize = Size.Md;

  //translation
  @property() toggleButtonAriaLabel = 'Toggle dropdown';

  protected override render(): TemplateResult {
    return html`
      <slot name="trigger">
        <oryx-button
          .type=${ButtonType.Icon}
          .size=${this.triggerIconSize}
          .color=${ButtonColor.Neutral}
          .label=${this.toggleButtonAriaLabel}
          .icon=${IconTypes.Actions}
        ></oryx-button>
      </slot>

      <oryx-popover
        ?show=${this.open}
        @oryx.close=${(): void => this.onClose()}
        ?inert=${!this.open}
      >
        <slot></slot>
      </oryx-popover>
    `;
  }

  protected get trigger(): Element | null | undefined {
    return this.renderRoot?.querySelector('slot[name="trigger"]');
  }

  /**
   * Restoring focus on the trigger when dropdown is closing
   */
  protected onClose(): void {
    if (
      this.matches(':focus-within') &&
      !this.trigger?.matches(':focus-within')
    ) {
      queryFirstFocusable(this.trigger as HTMLElement)?.focus();
    }
  }
}
