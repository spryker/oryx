import { CheckoutMixin, isValid } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import {
  Address,
  AddressEventDetail,
  AddressService,
} from '@spryker-oryx/user';
import { effect, hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { CheckoutAddressComponent } from '../address';
import { styles } from './delivery.styles';

@hydratable()
export class CheckoutDeliveryComponent
  extends CheckoutMixin(LitElement)
  implements isValid
{
  static styles = [styles];

  protected addressService = resolve(AddressService);

  protected addresses = signal(this.addressService.getAddresses());
  protected selected = signal(this.checkoutStateService.get('shippingAddress'));

  protected autoSelect = effect(() => {
    const addresses = this.addresses();
    const selected = this.selected();
    if (
      !selected ||
      (addresses && !addresses?.find((address) => selected.id === address.id))
    ) {
      if (addresses?.length) this.persist(addresses[0], true);
    }
  });

  @query('oryx-checkout-address')
  protected addressComponent?: CheckoutAddressComponent;

  protected override render(): TemplateResult {
    return html`
      <h3>${i18n('checkout.steps.delivery')}</h3>
      ${when(
        this.addresses()?.length,
        () =>
          html`<oryx-checkout-manage-address
            @change=${this.onChange}
          ></oryx-checkout-manage-address>`
      )}
      <oryx-checkout-address
        .addressId=${this.selected()?.id}
        @change=${this.onChange}
      ></oryx-checkout-address>
    `;
  }

  isValid(report: boolean): boolean {
    return !!this.addressComponent?.isValid(report);
  }

  protected onChange(e: CustomEvent<AddressEventDetail>): void {
    if (e.detail?.address) this.persist(e.detail.address, e.detail.valid);
  }

  protected persist(value: Address, valid?: boolean): void {
    this.checkoutStateService.set('shippingAddress', { valid, value });
  }
}
