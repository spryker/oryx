import { CheckoutMixin, isValid } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ButtonType } from '@spryker-oryx/ui/button';
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
import { billingAddressStyles } from './billing-address.styles';

@hydratable()
export class CheckoutBillingAddressComponent
  extends CheckoutMixin(LitElement)
  implements isValid
{
  static styles = [billingAddressStyles];

  protected addressService = resolve(AddressService);

  protected addresses = signal(this.addressService.getAddresses());
  protected selected = signal(this.checkoutStateService.get('billingAddress'));
  protected shippingAddress = signal(
    this.checkoutStateService.get('shippingAddress')
  );

  protected same = signal(true);

  protected autoSelect = effect(() => {
    const addresses = this.addresses();
    if (!addresses?.length) return;
    const selected = this.selected();

    if (!selected || !addresses.find((address) => selected.id === address.id)) {
      const defaultAddress = addresses.find((a) => a.isDefaultBilling);
      this.persist(defaultAddress ?? addresses[0], true);
    }
  });

  protected persistCopy = effect(() => {
    const deliveryAddress = this.shippingAddress();
    if (this.same() && deliveryAddress) {
      this.checkoutStateService.set('billingAddress', {
        valid: true,
        value: deliveryAddress,
      });
    }
  });

  @query('oryx-checkout-address')
  protected checkoutAddress?: CheckoutAddressComponent;

  protected override render(): TemplateResult {
    return html`
      <h3>${i18n('checkout.steps.billing-address')}</h3>
      ${when(
        this.addresses()?.length,
        () =>
          html`<oryx-checkout-manage-address
            @change=${this.onChange}
            .selected=${this.selected()}
          ></oryx-checkout-manage-address>`,
        () =>
          html`<oryx-button .type=${ButtonType.Text}>
            <button @click=${this.doSame}>
              ${i18n(
                this.same()
                  ? 'checkout.billing-address.change'
                  : 'checkout.billing-address.same-as-delivery-address'
              )}
            </button></oryx-button
          >`
      )}
      ${when(
        this.same(),
        () =>
          html`${i18n('checkout.billing-address.same-as-delivery-address')}`,
        () => html`<oryx-checkout-address
          .addressId=${this.selected()?.id}
          @change=${this.onChange}
        ></oryx-checkout-address>`
      )}
    `;
  }

  protected doSame(): void {
    this.same.set(!this.same());
  }

  isValid(report: boolean): boolean {
    return !!this.checkoutAddress?.isValid(report);
  }

  protected onChange(e: CustomEvent<AddressEventDetail>): void {
    // only persist when it's not the same
    if (!this.same()) {
      if (e.detail?.address) this.persist(e.detail.address, e.detail.valid);
    }
  }

  protected persist(value: Address, valid?: boolean): void {
    this.checkoutStateService.set('billingAddress', { valid, value });
  }
}
