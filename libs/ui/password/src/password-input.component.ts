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
        after: this.affixController.renderSuffix(this.renderActionIcon()),
      })}
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
    const icon = this.isVisible ? ICON_INVISIBLE : ICON_VISIBLE;

    switch (this.strategy) {
      case PasswordVisibilityStrategy.NONE:
        return html``;
      case PasswordVisibilityStrategy.HOVER:
        return html`
          <oryx-icon
            @mouseover=${this.showVisibility}
            @mouseout=${this.hideVisibility}
          >
            ${icon}
          </oryx-icon>
        `;

      case PasswordVisibilityStrategy.MOUSEDOWN:
        return html`
          <oryx-icon
            @mousedown=${this.toggleVisibility}
            @mouseup=${this.hideVisibility}
            @mouseout=${this.hideVisibility}
          >
            ${icon}
          </oryx-icon>
        `;

      default:
        return html`
          <oryx-icon size="medium" @click=${this.toggleVisibility}>
            ${icon}
          </oryx-icon>
        `;
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
