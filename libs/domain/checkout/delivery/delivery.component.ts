import { CheckoutForm, CheckoutMixin } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { CheckoutAddressComponent } from '../address';
import { CheckoutDataService } from '../src/services/checkout-data.service';
import { styles } from './delivery.styles';

@hydratable()
export class CheckoutDeliveryComponent
  extends CheckoutMixin(LitElement)
  implements CheckoutForm
{
  static styles = [styles];

  protected dataService = resolve(CheckoutDataService);
  protected selected = signal(this.dataService.selected('shippingAddress'));
  protected addresses = signal(resolve(AddressService).getAddresses());

  @query('oryx-checkout-address')
  protected addressComponent?: CheckoutAddressComponent;

  protected override render(): TemplateResult {
    return html`
      <h3>${i18n('checkout.steps.delivery')}</h3>
      ${when(
        this.addresses()?.length,
        () =>
          html`<oryx-checkout-manage-address></oryx-checkout-manage-address>`
      )}
      <oryx-checkout-address
        @selectedAddress=${this.onChangeAddress}
        .address=${this.selected()}
      ></oryx-checkout-address>
    `;
  }

  validate(report: boolean): boolean {
    return !!this.addressComponent?.validate(report);
  }

  protected onChangeAddress(e: CustomEvent): void {
    this.dataService.set('shippingAddress', e.detail.data, e.detail.valid);
  }
}
