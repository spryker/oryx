import { Address, CheckoutMixin } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Observable, of } from 'rxjs';
import { CheckoutAddressComponent } from '../../address/src';
import { styles } from './delivery.styles';

@hydratable()
export class CheckoutDeliveryComponent extends CheckoutMixin(LitElement) {
  static styles = [styles];

  @query('oryx-checkout-address')
  protected addressComponent?: CheckoutAddressComponent;
  protected addresses = signal(resolve(AddressService).getAddresses());

  connectedCallback(): void {
    super.connectedCallback();
    this.checkoutService.register('shippingAddress', () => this.collect(), 2);
  }

  protected override render(): TemplateResult {
    return html`
      <h3>${i18n('checkout.steps.delivery')}</h3>
      ${when(
        this.addresses()?.length,
        () =>
          html`<oryx-checkout-manage-address></oryx-checkout-manage-address>`
      )}
      <oryx-checkout-address></oryx-checkout-address>
    `;
  }

  protected collect(): Observable<Address | null> {
    if (!this.addressComponent) return of();
    return this.addressComponent.collect();
  }
}
