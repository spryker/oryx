import { ComponentMixin } from '@spryker-oryx/experience';
import { html, TemplateResult } from 'lit';
import { CartEntryOptions } from '../../entry.model';
import { cartEntryTotalsStyles } from './totals.styles';

export class CartEntryTotalsComponent extends ComponentMixin<CartEntryOptions>() {
  static styles = cartEntryTotalsStyles;

  protected render(): TemplateResult {
    const price = this.options?.calculations?.unitPriceToPayAggregation;

    return html`
      <cart-entry-price .price=${price}> Total price </cart-entry-price>
    `;
  }
}
