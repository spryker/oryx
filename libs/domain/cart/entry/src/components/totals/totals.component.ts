import { ComponentMixin } from '@spryker-oryx/experience';
import { CartEntryOptions } from '../../entry.model';
import { cartEntryTotalsStyles } from './totals.styles';

export class CartEntryTotalsComponent extends ComponentMixin<CartEntryOptions>() {
  static styles = cartEntryTotalsStyles;

  // protected render(): TemplateResult {
  // const price = this.options?.calculations?.sumPriceToPayAggregation;

  // return html`
  //   <cart-entry-price .price="${price}" ?loading="${this.options?.updating}">
  //     Total price
  //   </cart-entry-price>
  // `;
  // }
}
