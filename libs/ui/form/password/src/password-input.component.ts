import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../../../error-message/src/index';
import {
  AffixController,
  AffixOptions,
  FormControlController,
  FormControlOptions,
  inputStyles,
} from '../../../form/input';
import { invisible, visible } from '../../../Graphical/icon/src/icons';
import { getControl } from '../../utilities/getControl';
import { PasswordVisibilityStrategy } from './password-input.model';
import { passwordInputStyles } from './password-input.styles';

export class PasswordInputComponent
  extends LitElement
  implements FormControlOptions, AffixOptions
{
  static styles = [...inputStyles, passwordInputStyles];

  @property() label?: string;
  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;
  @property() prefixIcon?: string;
  @property({ type: Boolean }) prefixFill?: boolean;
  @property() suffixIcon?: string;
  @property({ type: Boolean }) suffixFill?: boolean;

  protected formControlController = new FormControlController(this);
  protected affixController = new AffixController(this);

  /**
   * The visibility strategy determines the UI event that is used to make the password visible.
   *
   * While the UI event will make the password visible, it will become invisible after the timeout is passed.
   */
  @property()
  strategy: PasswordVisibilityStrategy = PasswordVisibilityStrategy.CLICK;

  /**
   * Sets the timeout in milliseconds that is used to revoke the visibility of the password.
   *
   * Defaults to `5000`.
   */
  @property({ type: Number }) timeout = 5000;

  protected override render(): TemplateResult {
    return html`
      ${this.formControlController.render({
        before: this.affixController.renderPrefix(),
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
    switch (this.strategy) {
      case PasswordVisibilityStrategy.NONE:
        return html``;
      case PasswordVisibilityStrategy.HOVER:
        return html`
          <oryx-icon
            @mouseover=${this.showVisibility}
            @mouseout=${this.hideVisibility}
          >
            ${this.getIcon()}
          </oryx-icon>
        `;

      case PasswordVisibilityStrategy.MOUSEDOWN:
        return html`
          <oryx-icon
            @mousedown=${this.showVisibility}
            @mouseup=${this.hideVisibility}
            @mouseout=${this.hideVisibility}
          >
            ${this.getIcon()}
          </oryx-icon>
        `;

      default:
        return html`
          <oryx-icon @click=${this.toggleVisibility}>
            ${this.getIcon()}
          </oryx-icon>
        `;
    }
  }

  /**
   * @returns a single SVG with both visible and invisible icons, which will be shown/hidden by CSS.
   */
  protected getIcon(): TemplateResult {
    return html`<svg viewBox="0 0 24 24">
      <g class="invisible">${invisible.source}</g>
      <g class="visible">${visible.source}</g>
    </svg>`;
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
