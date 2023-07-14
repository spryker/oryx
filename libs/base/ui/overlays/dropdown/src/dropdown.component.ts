import { IconTypes } from '@spryker-oryx/ui/icon';
import { PopoverController } from '@spryker-oryx/ui/popover';
import { hydrate, queryFirstFocusable, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DropdownProperties, Position } from './dropdown.model';
import { dropdownBaseStyles, dropdownStyles } from './styles';

@hydrate({ event: ['mouseover', 'focusin'] })
export class DropdownComponent
  extends LitElement
  implements DropdownProperties
{
  static styles = [dropdownBaseStyles, dropdownStyles];
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
        <oryx-icon-button .size=${this.triggerIconSize}>
          <button aria-label=${this.toggleButtonAriaLabel}>
            <slot name="icon"
              ><oryx-icon .type=${IconTypes.Actions}></oryx-icon
            ></slot>
          </button>
        </oryx-icon-button>
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
