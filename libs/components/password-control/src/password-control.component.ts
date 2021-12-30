import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../../error-message/src/index';
import { FormControlComponent } from '../../form-control';
import { ICON_INVISIBLE, ICON_VISIBLE } from './icons';
import { PasswordVisibilityStrategy } from './model';
import { passwordStyles } from './password.styles';

export class PasswordControlComponent extends FormControlComponent {
  static styles = [passwordStyles];

  @property()
  strategy: PasswordVisibilityStrategy = PasswordVisibilityStrategy.CLICK;

  /**
   * Sets the timeout in milliseconds that is used to revoke the visibility of the password.
   *
   * Defaults to `5000`.
   */
  @property({ type: Number }) timeout?: number = 5000;

  protected _isVisible = false;

  render(): TemplateResult {
    return html`
      <oryx-text-control .label=${this.label} ?disabled=${this.disabled}>
        <slot></slot>
        ${this.renderButton()}
      </oryx-text-control>
    `;
  }

  protected renderButton(): TemplateResult {
    const icon = html` <oryx-icon size="medium">
      ${this.isVisible ? ICON_INVISIBLE : ICON_VISIBLE}
    </oryx-icon>`;

    switch (this.strategy) {
      case PasswordVisibilityStrategy.NONE:
        return html``;
      case PasswordVisibilityStrategy.HOVER:
        return html`<button
          slot="suffix"
          @mouseover=${this.showVisibility}
          @mouseout=${this.hideVisibility}
        >
          ${icon}
        </button>`;

      case PasswordVisibilityStrategy.MOUSEDOWN:
        return html`<button
          slot="suffix"
          @mousedown=${this.toggleVisibility}
          @mouseup=${this.hideVisibility}
          @mouseout=${this.hideVisibility}
        >
          ${icon}
        </button>`;

      default:
        return html`<button slot="suffix" @click=${this.toggleVisibility}>
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

  protected get isVisible(): boolean {
    return this._isVisible;
  }
  protected set isVisible(value: boolean) {
    if (this.control) {
      const lastVal = this._isVisible;
      this._isVisible = value;
      if (this._isVisible) {
        this.control.setAttribute('type', 'text');
      } else {
        this.control.setAttribute('type', 'password');
      }
      this.requestUpdate('isVisible', lastVal);
    }
  }
}
