import { hydrate, I18nMixin, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { cartTotalsCouponStyles } from './coupon.styles';

@hydrate({ event: 'window:load' })
@signalAware()
export class CartTotalsCouponComponent extends I18nMixin(LitElement) {
  static styles = cartTotalsCouponStyles;

  // protected totalsController = new TotalsController(this);

  // protected $totals = signal(this.totalsController.getTotals());

  protected override render(): TemplateResult | void {
    return html`
      <!-- <span>${this.i18n('cart.totals.coupons')}</span> -->

      <oryx-collapsible heading="Coupons" open>
        <ul>
          <li>
            <oryx-icon type="check_circle" valid></oryx-icon> 1234-ABC-1234-01
          </li>
        </ul>
      </oryx-collapsible>
    `;
  }
}
