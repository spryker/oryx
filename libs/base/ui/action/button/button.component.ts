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

  @property({ reflect: true }) type?: ButtonType;
  @property({ reflect: true }) size?: ButtonSize;
  @property({ type: Boolean, reflect: true }) block?: boolean;

  @property() set color(color: ButtonColor) {
    if (!color) return;
    this.style.setProperty('--_c0', `var(--oryx-color-${color}-0, white)`);
    this.style.setProperty('--_c1', `var(--oryx-color-${color}-1)`);
    this.style.setProperty('--_c3', `var(--oryx-color-${color}-3)`);
    this.style.setProperty('--_c7', `var(--oryx-color-${color}-7)`);
    this.style.setProperty('--_c8', `var(--oryx-color-${color}-8)`);
    this.style.setProperty('--_c9', `var(--oryx-color-${color}-9)`);
    this.style.setProperty('--_c10', `var(--oryx-color-${color}-10)`);
  }

  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ type: Boolean, reflect: true }) loading?: boolean;
  @property({ type: Boolean, reflect: true }) confirmed?: boolean;

  protected willUpdate(props: PropertyValues): void {
    super.willUpdate(props);
    this.setAttributes();
  }

  protected override render(): TemplateResult {
    return html`
      ${[this.renderLoader(), this.renderConfirmed()]}
      <slot name="custom">
        ${when(
          this.href,
          () => this.renderLink(),
          () => this.renderButton()
        )}
      </slot>
      ${preHydrate(hydrateSlotChange, this.tagName.toLowerCase())}
    `;
  }

  protected renderButton(): TemplateResult {
    return html`
      <button
        part="button"
        type="button"
        ?disabled=${this.disabled}
        ?empty=${!this.text}
        .ariaLabel=${this.label}
      >
        ${this.renderContent()}
      </button>
    `;
  }

  protected renderLink(): TemplateResult {
    return html`
      <a part="link" href=${this.href} aria-label=${ifDefined(this.label)}>
        ${this.renderContent()}
      </a>
    `;
  }

  protected renderContent(): TemplateResult {
    return html`${this.renderIcon()}${this.text}
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
