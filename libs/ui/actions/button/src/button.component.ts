import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { Size } from '../../../utilities';
import { ButtonType } from './button.model';
import { buttonStyles } from './button.styles';

export class ButtonComponent extends LitElement {
  static styles = [buttonStyles];

  @property({ reflect: true }) size?: Size;
  @property({ reflect: true }) type?: ButtonType;
  @property({ type: Boolean }) loading?: boolean;
  @property({ type: Boolean }) outline?: boolean;

  protected override render(): TemplateResult {
    return html`<slot ?inert=${this.loading}></slot>`;
  }
}
