import { IconComponent, Icons, IconTypes } from '@spryker-oryx/ui/icon';
import {
  html,
  isServer,
  LitElement,
  PropertyValues,
  TemplateResult,
} from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import {
  ButtonComponentAttributes,
  ButtonColor,
  ButtonType,
  ButtonSize,
} from './button.model';
import { buttonStyles } from './button.styles';
import { ifDefined } from 'lit/directives/if-defined.js';
import { hydrate, ssrShim } from '@spryker-oryx/utilities';
import { preHydrate } from '@spryker-oryx/core';
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
  @property({ reflect: true })
  set color(color: ButtonColor) {
    if (!color) return;
    this.style.setProperty('--_c0', `var(--oryx-color-${color}-0, white)`);
    this.style.setProperty('--_c1', `var(--oryx-color-${color}-1)`);
    this.style.setProperty('--_c3', `var(--oryx-color-${color}-3)`);
    this.style.setProperty('--_c8', `var(--oryx-color-${color}-8)`);
    this.style.setProperty('--_c9', `var(--oryx-color-${color}-9)`);
    this.style.setProperty('--_c10', `var(--oryx-color-${color}-10)`);
  }

  @property({ type: Boolean, reflect: true }) loading?: boolean;
  @property({ type: Boolean, reflect: true }) confirmed?: boolean;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  @property({ type: Boolean }) custom?: boolean;

  protected willUpdate(props: PropertyValues): void {
    super.willUpdate(props);
    this.setAttributes();
  }

  protected override render(): TemplateResult {
    const template = [this.renderLoader(), this.renderConfirmed()];

    if (!this.custom && (this.text || this.icon)) {
      template.push(html`${this.renderIcon()}${this.text}`);
    } else {
      template.push(
        html`<slot @slotchange=${() => this.onSlotChange()}>
            ${this.renderIcon()}${this.text}
          </slot>
          ${preHydrate(hydrateSlotChange, this.tagName.toLowerCase())}`
      );
      if (this.custom) return html`${template}`;
    }

    if (this.href) {
      return html`<a
        part="link"
        href=${this.href}
        aria-label=${ifDefined(this.label)}
        >${template}</a
      >`;
    }

    return html`
      <button
        part="button"
        type="button"
        ?disabled=${this.disabled}
        ?empty=${!this.text}
        .ariaLabel=${this.label}
      >
        ${template}
      </button>
    `;
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

  protected renderLoader(): TemplateResult | void {
    if (!this.loading) return;
    return html`<oryx-icon loader .type=${IconTypes.Loader}></oryx-icon>`;
  }

  protected renderConfirmed(): TemplateResult | void {
    if (!this.confirmed) return;
    return html`<oryx-icon confirmed .type=${IconTypes.Check}></oryx-icon>`;
  }
}
