import { Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property } from 'lit/decorators.js';
import { ButtonComponentAttributes, ButtonType } from './button.model';
import { buttonStyles } from './styles';

export class ButtonComponent
  extends LitElement
  implements ButtonComponentAttributes
{
  static styles = buttonStyles;

  @property({ reflect: true }) size?: Size;
  @property({ reflect: true }) type?: ButtonType;
  @property({ type: Boolean, reflect: true }) loading?: boolean;
  @property({ type: Boolean, reflect: true }) confirmed?: boolean;
  @property({ type: Boolean, reflect: true }) outline?: boolean;

  protected override render(): TemplateResult {
    return html`<slot ?inert=${this.loading}></slot> ${this.renderLoader()}`;
  }

  protected renderLoader(): TemplateResult | void {
    if (!this.loading && !this.confirmed) return;
    const icon = this.loading ? 'loader' : 'mark';
    return html` <oryx-icon .type=${icon} .size=${Size.Lg}></oryx-icon> `;
  }
}
