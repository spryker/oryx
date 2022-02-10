import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../../error-message/src/index';
import {
  AffixController,
  AffixOptions,
  FormControlController,
  FormControlOptions,
  inputStyles,
} from '../../input';
import { OryxElement } from '../../utilities';
import { ICON_INVISIBLE, ICON_VISIBLE } from './icons';
import { PasswordVisibilityStrategy } from './password-input.model';
import { passwordInputStyles } from './password-input.styles';

export interface PasswordOptions extends FormControlOptions, AffixOptions {}

export class PasswordInputComponent
  extends LitElement
  implements OryxElement<PasswordOptions>
{
  static styles = [...inputStyles, passwordInputStyles];

  @property({ type: Object }) options: PasswordOptions = {};

  protected formControlController = new FormControlController(this);
  protected affixController = new AffixController(this);

  /**
   * The visibility strategy determines the UI event that is used to make the password visible.
   */
  @property()
  strategy: PasswordVisibilityStrategy = PasswordVisibilityStrategy.CLICK;

  /**
   * Sets the timeout in milliseconds that is used to revoke the visibility of the password.
   *
   * Defaults to `5000`.
   */
  @property({ type: Number }) timeout?: number = 5000;

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        after: this.affixController.renderSuffix(this.renderButton()),
      })}
    `;
  }

  /**
   * Renders the suffix content for the text control.
   *
   * Adds a button to show the password.
   */
  protected renderButton(): TemplateResult {
    const icon = html` <oryx-icon size="medium">
      ${this.isVisible ? ICON_INVISIBLE : ICON_VISIBLE}
    </oryx-icon>`;

    switch (this.strategy) {
      case PasswordVisibilityStrategy.NONE:
        return html``;
      case PasswordVisibilityStrategy.HOVER:
        return html`<button
          @mouseover=${this.showVisibility}
          @mouseout=${this.hideVisibility}
          tabindex="-1"
        >
          ${icon}
        </button>`;

      case PasswordVisibilityStrategy.MOUSEDOWN:
        return html`<button
          @mousedown=${this.toggleVisibility}
          @mouseup=${this.hideVisibility}
          @mouseout=${this.hideVisibility}
          tabindex="-1"
        >
          ${icon}
        </button>`;

      default:
        return html`<button @click=${this.toggleVisibility} tabindex="-1">
          ${icon}
        </button>`;
    }
  }

  protected toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    if (this.isVisible && this.timeout) {
      setTimeout(() => {
        if (this.isVisible) {
          this.hideVisibility();
        }
      }, this.timeout);
    }
  }

  protected showVisibility(): void {
    if (this.strategy !== PasswordVisibilityStrategy.NONE) {
      this.isVisible = true;
    }
  }

  protected hideVisibility(): void {
    this.isVisible = false;
  }

  protected _isVisible = false;
  protected get isVisible(): boolean {
    return this._isVisible;
  }
  protected set isVisible(value: boolean) {
    if (this.formControlController.control) {
      const lastVal = this._isVisible;
      this._isVisible = value;
      if (this._isVisible) {
        this.formControlController.control.setAttribute('type', 'text');
      } else {
        this.formControlController.control.setAttribute('type', 'password');
      }
      this.requestUpdate('isVisible', lastVal);
    }
  }
}
