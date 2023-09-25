import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  AffixController,
  AffixOptions,
  FormControlController,
  FormControlOptions,
  baseStyles as inputBaseStyles,
} from '@spryker-oryx/ui/input';
import {
  I18nMixin,
  I18nTranslationValue,
  Size,
  hydrate,
  i18n,
} from '@spryker-oryx/utilities';
import { LitElement, PropertyValues, TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { getControl } from '../../utilities/getControl';
import {
  PasswordValidationOptions,
  PasswordVisibilityStrategy,
} from './password-input.model';
import { baseStyles } from './password-input.styles';

@hydrate()
export class PasswordInputComponent
  extends I18nMixin(LitElement)
  implements FormControlOptions, AffixOptions, PasswordValidationOptions
{
  static styles = [...inputBaseStyles, baseStyles];

  @property() label?: string;
  @property() errorMessage?: string;
  @property({ type: Boolean, reflect: true }) floatLabel?: boolean;
  @property({ type: Boolean, reflect: true }) hasError?: boolean;
  @property() prefixIcon?: string;
  @property({ type: Boolean, reflect: true }) prefixFill?: boolean;
  @property() suffixIcon?: string;
  @property({ type: Boolean, reflect: true }) suffixFill?: boolean;
  @property({ type: Number }) minLength?: number;
  @property({ type: Number }) maxLength?: number;
  @property({ type: Number }) minUppercaseChars?: number;
  @property({ type: Number }) minNumbers?: number;
  @property({ type: Number }) minSpecialChars?: number;

  protected formControlController = new FormControlController(this);
  protected affixController = new AffixController(this);

  /**
   * The visibility strategy determines the UI event that is used to make the password visible.
   *
   * While the UI event will make the password visible, it will become invisible after the timeout is passed.
   */
  @property()
  strategy: PasswordVisibilityStrategy = PasswordVisibilityStrategy.Click;

  /**
   * Sets the timeout in milliseconds that is used to revoke the visibility of the password.
   *
   * Defaults to `5000`.
   */
  @property({ type: Number }) timeout = 5000;

  @property({ type: Boolean }) visible?: boolean;

  @state()
  minLengthError = true;
  @state()
  maxLengthError = true;
  @state()
  minUppercaseCharsError = true;
  @state()
  minNumbersError = true;
  @state()
  minSpecialCharsError = true;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('input', this.setValidation);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('input', this.setValidation);
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.setValidation();
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (
      _changedProperties.has('minLength') ||
      _changedProperties.has('maxLength')
    ) {
      this.setValidation();
    }
    super.updated(_changedProperties);
  }

  isValid(): boolean {
    return (
      !this.minLengthError &&
      !this.maxLengthError &&
      !this.minUppercaseCharsError &&
      !this.minNumbersError &&
      !this.minSpecialCharsError
    );
  }

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.affixController.renderPrefix(),
        after: this.affixController.renderSuffix(this.renderActionIcon()),
      })}
      ${this.renderValidation()}
    `;
  }

  protected setValidation(): void {
    const value = this.control.value;

    this.minLengthError = !!(this.minLength && value.length < this.minLength);
    this.maxLengthError = !!(this.maxLength && value.length > this.maxLength);
    this.minUppercaseCharsError = !!(
      this.minUppercaseChars &&
      (value.match(/[A-Z]/g) || []).length < this.minUppercaseChars
    );
    this.minNumbersError = !!(
      this.minNumbers && (value.match(/[0-9]/g) || []).length < this.minNumbers
    );
    this.minSpecialCharsError = !!(
      this.minSpecialChars &&
      (value.match(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/g) || []).length <
        this.minSpecialChars
    );
  }

  protected renderValidation(): TemplateResult {
    return html`
      ${this.minLength
        ? this.renderValidationMessage(
            this.minLengthError,
            i18n('ui.password.at-least-<count>-characters', {
              count: this.minLength,
            })
          )
        : ''}
      ${this.maxLength
        ? this.renderValidationMessage(
            this.maxLengthError,
            i18n('ui.password.at-most-<count>-characters', {
              count: this.maxLength,
            })
          )
        : ''}
      ${this.minUppercaseChars
        ? this.renderValidationMessage(
            this.minUppercaseCharsError,
            i18n('ui.password.at-least-<count>-uppercase-letters', {
              count: this.minUppercaseChars,
            })
          )
        : ''}
      ${this.minNumbers
        ? this.renderValidationMessage(
            this.minNumbersError,
            i18n('ui.password.at-least-<count>-numbers', {
              count: this.minNumbers,
            })
          )
        : ''}
      ${this.minSpecialChars
        ? this.renderValidationMessage(
            this.minSpecialCharsError,
            i18n('ui.password.at-least-<count>-special-chars', {
              count: this.minSpecialChars,
            })
          )
        : ''}
    `;
  }

  protected renderValidationMessage(
    errorState: boolean,
    message: I18nTranslationValue
  ): TemplateResult {
    return html`
      <div class="validation-message ${errorState ? '' : 'active'}">
        <oryx-icon type=${IconTypes.Check} size=${Size.Sm}></oryx-icon>
        ${message}
      </div>
    `;
  }

  /**
   * Adds an icon to show the password.
   *
   * This is not a button, since it's supposed to be not available to
   * non-sighted users; there's no point in offering a user with low vision
   * the possibility to show the password.
   */
  protected renderActionIcon(): TemplateResult {
    switch (this.strategy) {
      case PasswordVisibilityStrategy.None:
        return html``;
      case PasswordVisibilityStrategy.Hover:
        return html`
          <oryx-icon
            type=${this.visibilityIcon}
            @mouseover=${this.showVisibility}
            @mouseout=${this.hideVisibility}
          ></oryx-icon>
        `;

      case PasswordVisibilityStrategy.Mousedown:
        return html`
          <oryx-icon
            type=${this.visibilityIcon}
            @mousedown=${this.showVisibility}
            @mouseup=${this.hideVisibility}
            @mouseout=${this.hideVisibility}
          ></oryx-icon>
        `;

      default:
        return html`
          <oryx-icon
            type=${this.visibilityIcon}
            @click=${this.toggleVisibility}
          ></oryx-icon>
        `;
    }
  }

  protected get visibilityIcon(): string {
    return this.visible ? IconTypes.Invisible : IconTypes.Visible;
  }

  protected toggleVisibility(): void {
    if (this.hasAttribute('visible')) {
      this.hideVisibility();
    } else {
      this.showVisibility();
    }
  }

  protected showVisibility(): void {
    this.toggleAttribute('visible', true);
    this.control.setAttribute('type', 'text');
    if (this.timeout > 0) {
      setTimeout(() => {
        if (this.hasAttribute('visible')) {
          this.hideVisibility();
        }
      }, this.timeout);
    }
  }

  protected hideVisibility(): void {
    this.toggleAttribute('visible', false);
    this.control.setAttribute('type', 'password');
  }

  protected get control(): HTMLInputElement {
    return getControl<HTMLInputElement>(this, 'input');
  }
}
