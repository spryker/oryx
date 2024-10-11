import { Icons, IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, preHydrate, ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import {
  ButtonColor,
  ButtonComponentAttributes,
  ButtonSize,
  ButtonType,
} from './button.model';
import { buttonStyles } from './button.styles';
import { hydrateSlotChange } from './prehydrate';

/**
 * The `oryx-button` can handle both form buttons and links. The UI will be the same
 * for a link or button.
 *
 * All buttons support both text and icons. The icons are typically rendered before the text,
 * but it is possible to "slot in" your customer UI.
 *
 * The button component comes in various flavours. There are different properties to influence the UI:
 *
 * ### ButtonType
 * The ButtonType supports 4 variations:
 * - `solid` a button with a solid background.
 * - `outline` a button with an outline and a neutral background.
 * - `icon` a button with no background and no outline, but with a border radius.
 * - `text` a button with no background and no outline.
 *
 * ### ButtonSize
 * The button comes in 3 sizes, `lg`, `md` and `sm`. The real estate of the button system is driven by a
 * size factor. The size factor is used to calculate the height of the button, it's inline padding and
 * the size of the icon.
 *
 * Some UI systems support a static icon size regardless of the button size. This is supported by design tokens
 * per button type:
 * -  `--oryx-button-solid-icon-size`
 * - ` --oryx-button-outline-icon-size`
 * - ` --oryx-button-text-icon-size`
 * - ` --oryx-button-icon-icon-size`
 *
 * ### Color
 * The `ButtonColor` supports 3 colors:
 * - Primary
 * - Neutral
 * - Error
 *
 * Only a couple of the color shades are used for the button UI.
 *
 */
@ssrShim('style')
@hydrate()
export class ButtonComponent
  extends LitElement
  implements ButtonComponentAttributes
{
  static styles = buttonStyles;

  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property() text?: string;
  @property() label?: string;
  @property() icon?: Icons | string;
  @property() href?: string;

  @property({ reflect: true }) type = ButtonType.Solid;
  @property({ reflect: true }) size = ButtonSize.Lg;
  @property({ reflect: true }) color?: ButtonColor;

  @property({ type: Boolean, reflect: true }) active?: boolean;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ type: Boolean, reflect: true }) loading?: boolean;
  @property({ type: Boolean, reflect: true }) confirmed?: boolean;

  protected willUpdate(props: PropertyValues): void {
    super.willUpdate(props);
    this.setAttributes();
  }

  protected override render(): TemplateResult {
    const templates = [this.renderLoader(), this.renderConfirmed()];

    const button = this.href ? this.renderLink() : this.renderButton();
    if (this.text || this.icon) {
      templates.push(button);
    } else {
      templates.push(html`<slot name="custom">${button}</slot>`);
    }

    return html`
      ${templates} ${preHydrate(hydrateSlotChange, this.tagName.toLowerCase())}
    `;
  }

  protected renderButton(): TemplateResult {
    return html`
      <button
        part="button"
        type="button"
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.label ?? this.text)}
        ?inert=${this.loading || this.confirmed || this.disabled}
      >
        ${this.renderContent()}
      </button>
    `;
  }

  protected renderLink(): TemplateResult {
    return html`
      <a
        part="button"
        href=${this.href}
        aria-label=${ifDefined(this.label ?? this.text)}
        ?inert=${this.loading || this.confirmed || this.disabled}
      >
        ${this.renderContent()}
      </a>
    `;
  }

  protected renderContent(): TemplateResult {
    return html`${this.renderIcon()}
      ${when(this.type !== ButtonType.Icon, () => html`${this.text}`)}
      <slot @slotchange=${() => this.onSlotChange()}> </slot>`;
  }

  protected onSlotChange(): void {
    this.setAttributes();
  }

  /**
   * There's no point in setting has-text when has-icon is false.
   */
  protected setAttributes(): void {
    const hasIcon = !!(this.icon || this.querySelector?.('oryx-icon'));
    this.toggleAttribute('has-icon', hasIcon);
    if (hasIcon) {
      this.toggleAttribute(
        'has-text',
        !!(this.text || this.textContent?.trim())
      );
    }
    this.toggleAttribute(
      'inert',
      !!(this.loading || this.confirmed || this.disabled)
    );
  }

  protected renderIcon(): TemplateResult | void {
    if (!this.icon) return;
    return html`<oryx-icon .type=${this.icon}></oryx-icon>`;
  }

  /**
   * The loader icon will be rendered when the component is not disabled.
   */
  protected renderLoader(): TemplateResult | void {
    if (!this.loading || this.disabled) return;
    return html`<oryx-icon loader .type=${IconTypes.Loader}></oryx-icon>`;
  }

  /**
   * The loader icon will be rendered when the component state is not disabled nor loading
   */
  protected renderConfirmed(): TemplateResult | void {
    if (!this.confirmed || this.disabled || this.loading) return;
    return html`<oryx-icon confirmed .type=${IconTypes.Check}></oryx-icon>`;
  }
}
