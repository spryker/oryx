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
  i18n,
} from '@spryker-oryx/utilities';
import { LitElement, PropertyValues, TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { getControl } from '../../utilities/getControl';
import { PasswordVisibilityStrategy } from './password-input.model';
import { baseStyles } from './password-input.styles';

export class PasswordInputComponent
  extends I18nMixin(LitElement)
  implements FormControlOptions, AffixOptions
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
  @property() minLength?: number;
  @property() maxLength?: number;
  @property({ type: Boolean, reflect: true }) requireUpperLetter?: boolean;
  @property({ type: Boolean, reflect: true }) requireNumber?: boolean;
  @property({ type: Boolean, reflect: true }) requireSpecialChar?: boolean;

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
  minLengthError = false;
  @state()
  maxLengthError = false;
  @state()
  requireUpperLetterError = false;
  @state()
  requireNumberError = false;
  @state()
  requireSpecialCharError = false;

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
    this.minLengthError = !!(
      this.minLength && this.control.value.length < this.minLength
    );
    this.maxLengthError = !!(
      this.maxLength && this.control.value.length > this.maxLength
    );
    this.requireUpperLetterError = !!(
      this.requireUpperLetter && !this.control.value.match(/[A-Z]/)
    );
    this.requireNumberError = !!(
      this.requireNumber && !this.control.value.match(/[0-9]/)
    );
    this.requireSpecialCharError = !!(
      this.requireSpecialChar &&
      !this.control.value.match(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)
    );
  }

  protected renderValidation(): TemplateResult {
    return html`
      ${when(this.minLength, () =>
        this.renderValidationMessage(
          this.minLengthError,
          i18n('password.at-least-<count>-characters', {
            count: this.minLength,
          })
        )
      )}
      ${when(this.maxLength, () =>
        this.renderValidationMessage(
          this.maxLengthError,
          i18n('password.at-most-<count>-characters', { count: this.maxLength })
        )
      )}
      ${when(this.requireUpperLetter, () =>
        this.renderValidationMessage(
          this.requireUpperLetterError,
          i18n('password.upper-and-lowercase-letters')
        )
      )}
      ${when(this.requireNumber, () =>
        this.renderValidationMessage(
          this.requireNumberError,
          i18n('password.a-number')
        )
      )}
      ${when(this.requireSpecialChar, () =>
        this.renderValidationMessage(
          this.requireSpecialCharError,
          i18n('password.a-symbol-(e.g.*$%)')
        )
      )}
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
