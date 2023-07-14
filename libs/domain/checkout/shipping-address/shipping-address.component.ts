import { CheckoutMixin, isValid } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import {
  Address,
  AddressEventDetail,
  AddressService,
} from '@spryker-oryx/user';
import {
  elementEffect,
  hydrate,
  I18nMixin,
  signal,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { CheckoutAddressComponent } from '../address';

@hydrate()
export class CheckoutShippingAddressComponent
  extends I18nMixin(CheckoutMixin(LitElement))
  implements isValid
{
  protected addressService = resolve(AddressService);

  protected $addresses = signal(this.addressService.getList());
  protected $selected = signal(
    this.checkoutStateService.get('shippingAddress')
  );

  @elementEffect()
  protected autoSelect = (): void => {
    const addresses = this.$addresses();
    if (!addresses?.length) return;
    const selected = this.$selected();

    if (!selected || !addresses.find((address) => selected.id === address.id)) {
      const defaultAddress = addresses.find((a) => a.isDefaultShipping);
      this.persist(defaultAddress ?? addresses[0], true);
    }
  };

  @query('oryx-checkout-address')
  protected checkoutAddress?: CheckoutAddressComponent;

  protected override render(): TemplateResult | void {
    if (this.$addresses() === undefined) return;

    return html`
      <oryx-checkout-header>
        <h3>${this.i18n('checkout.shipping-address')}</h3>
        ${when(
          this.$addresses()?.length,
          () =>
            html`<oryx-checkout-manage-address
              @change=${this.onChange}
              .selected=${this.$selected()}
            ></oryx-checkout-manage-address>`
        )}
      </oryx-checkout-header>
      <oryx-checkout-address
        .addressId=${this.$selected()?.id}
        @change=${this.onChange}
      ></oryx-checkout-address>
    `;
  }

  isValid(report: boolean): boolean {
    return !!this.checkoutAddress?.isValid(report);
  }

  protected onChange(e: CustomEvent<AddressEventDetail>): void {
    if (e.detail?.address) this.persist(e.detail.address, e.detail.valid);
  }

  protected persist(value: Address, valid?: boolean): void {
    this.checkoutStateService.set('shippingAddress', { valid, value });
  }
}
