import { html, LitElement, TemplateResult } from 'lit';
import { checkoutHeaderStyles } from './header.styles';

export class CheckoutHeaderComponent extends LitElement {
  static styles = checkoutHeaderStyles;

  protected override render(): TemplateResult {
    return html` <slot></slot>`;
  }
}
