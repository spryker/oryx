import { CheckoutMixin, isValid } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ActionType } from '@spryker-oryx/ui/action';
import { ButtonType } from '@spryker-oryx/ui/button';
import {
  Address,
  AddressEventDetail,
  AddressService,
} from '@spryker-oryx/user';
import {
  I18nMixin,
  elementEffect,
  hydrate,
  signal,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { CheckoutAddressComponent } from '../address';

@hydrate()
export class CheckoutBillingAddressComponent
  extends I18nMixin(CheckoutMixin(LitElement))
  implements isValid
{
  protected addressService = resolve(AddressService);

  protected $addresses = signal(this.addressService.getList());
  protected $selected = signal(this.checkoutStateService.get('billingAddress'));
  protected $shippingAddress = signal(
    this.checkoutStateService.get('shippingAddress')
  );
  protected $isSameAsShippingAddress = signal(true);

  @elementEffect()
  protected autoSelect = (): void => {
    const addresses = this.$addresses();
    if (!addresses?.length) return;
    const selected = this.$selected();

    if (!selected || !addresses.find((address) => selected.id === address.id)) {
      const defaultAddress = addresses.find((a) => a.isDefaultBilling);
      this.persist(defaultAddress ?? addresses[0], true);
    }
  };

  @elementEffect()
  protected persistCopy = (): void => {
    const deliveryAddress = this.$shippingAddress();
    if (
      deliveryAddress &&
      this.$isSameAsShippingAddress() &&
      this.$addresses()?.length === 0
    ) {
      this.checkoutStateService.set('billingAddress', {
        valid: true,
        value: deliveryAddress,
      });
    }
  };

  @query('oryx-checkout-address')
  protected checkoutAddress?: CheckoutAddressComponent;

  protected override render(): TemplateResult | void {
    if (this.$addresses() === undefined) return;
    return html`${this.renderHeading()}${this.renderBody()}`;
  }

  protected renderHeading(): TemplateResult {
    return html`<oryx-checkout-header>
      <h3>${this.i18n('checkout.billing-address')}</h3>
      ${when(
        this.$addresses()?.length,
        () => html`<oryx-checkout-manage-address
          @change=${this.onChange}
          .selected=${this.$selected()}
        ></oryx-checkout-manage-address>`,
        () => html` <!-- <oryx-button
            .type=${ButtonType.Text}
            @click=${this.reuseShippingAddress}
          >
            ${this.i18n(
            this.$isSameAsShippingAddress()
              ? 'checkout.billing-address.change'
              : 'checkout.billing-address.same-as-shipping-address'
          )}
          </oryx-button> -->
          <oryx-action
            .type=${ActionType.Text}
            cta
            @click=${this.reuseShippingAddress}
            .text=${this.i18n(
              this.$isSameAsShippingAddress()
                ? 'checkout.billing-address.change'
                : 'checkout.billing-address.same-as-shipping-address'
            )}
          ></oryx-action>`
      )}
    </oryx-checkout-header>`;
  }

  protected renderBody(): TemplateResult {
    if (!this.$addresses()?.length && this.$isSameAsShippingAddress()) {
      return html`${this.i18n(
        'checkout.billing-address.same-as-shipping-address'
      )}`;
    } else {
      return html`<oryx-checkout-address
        .addressId=${this.$selected()?.id}
        @change=${this.onChange}
      ></oryx-checkout-address>`;
    }
  }

  protected reuseShippingAddress(): void {
    this.$isSameAsShippingAddress.set(!this.$isSameAsShippingAddress());
  }

  isValid(report: boolean): boolean {
    return !!this.checkoutAddress?.isValid(report);
  }

  protected onChange(e: CustomEvent<AddressEventDetail>): void {
    if (
      e.detail?.address &&
      (!this.$isSameAsShippingAddress() || this.$addresses()?.length)
    ) {
      this.persist(e.detail.address, e.detail.valid);
    }
  }

  protected persist(value: Address, valid?: boolean): void {
    this.checkoutStateService.set('billingAddress', { valid, value });
  }
}
