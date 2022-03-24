import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ButtonSize, ButtonType } from './button.model';
import { buttonStyles } from './button.styles';

export class ButtonComponent extends LitElement {
  static styles = [buttonStyles];

  @property({ reflect: true }) size?: ButtonSize;
  @property({ reflect: true }) type?: ButtonType;
  @property({ type: Boolean }) loading?: boolean;
  @property({ type: Boolean }) outline?: boolean;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
