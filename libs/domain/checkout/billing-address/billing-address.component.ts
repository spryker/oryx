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

  protected sameAsShippingAddress = signal(true);

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
    if (this.sameAsShippingAddress() && deliveryAddress) {
      this.checkoutStateService.set('billingAddress', {
        valid: true,
        value: deliveryAddress,
      });
    }
  });

  @query('oryx-checkout-address')
  protected checkoutAddress?: CheckoutAddressComponent;

  protected override render(): TemplateResult {
    return html`${this.renderHeading()}${this.renderBody()}`;
  }

  protected renderHeading(): TemplateResult[] {
    const templates = [
      html`<h3>${i18n('checkout.steps.billing-address')}</h3>`,
    ];
    if (this.addresses()?.length) {
      templates.push(html`<oryx-checkout-manage-address
        @change=${this.onChange}
        .selected=${this.selected()}
      ></oryx-checkout-manage-address>`);
    } else {
      templates.push(html`<oryx-button .type=${ButtonType.Text}>
        <button @click=${this.reuseShippingAddress}>
          ${i18n(
            this.sameAsShippingAddress()
              ? 'checkout.billing-address.change'
              : 'checkout.billing-address.same-as-shipping-address'
          )}
        </button></oryx-button
      >`);
    }
    return templates;
  }

  protected renderBody(): TemplateResult {
    if (!this.addresses()?.length && this.sameAsShippingAddress()) {
      return html`${i18n('checkout.billing-address.same-as-shipping-address')}`;
    } else {
      return html`<oryx-checkout-address
        .addressId=${this.selected()?.id}
        @change=${this.onChange}
      ></oryx-checkout-address>`;
    }
  }

  protected reuseShippingAddress(): void {
    this.sameAsShippingAddress.set(!this.sameAsShippingAddress());
  }

  isValid(report: boolean): boolean {
    return !!this.checkoutAddress?.isValid(report);
  }

  protected onChange(e: CustomEvent<AddressEventDetail>): void {
    if (!this.sameAsShippingAddress() || this.addresses()?.length) {
      if (e.detail?.address) this.persist(e.detail.address, e.detail.valid);
    }
  }

  protected persist(value: Address, valid?: boolean): void {
    this.checkoutStateService.set('billingAddress', { valid, value });
  }
}
