import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  AffixController,
  AffixOptions,
  baseStyles as inputBaseStyles,
  FormControlController,
  FormControlOptions,
} from '@spryker-oryx/ui/input';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { getControl } from '../../utilities/getControl';
import { PasswordVisibilityStrategy } from './password-input.model';
import { baseStyles } from './password-input.styles';

export class PasswordInputComponent
  extends LitElement
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
