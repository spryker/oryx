import { AuthService } from '@spryker-oryx/auth';
import { CheckoutDataService, CheckoutService } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ComponentMixin } from '@spryker-oryx/experience';
import { asyncValue, i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { combineLatest, map } from 'rxjs';

export class CheckoutPlaceOrderComponent extends ComponentMixin() {
  protected checkout = resolve(CheckoutService);

  protected isGuestCheckout$ = resolve(CheckoutDataService).isGuestCheckout();
  protected isAuthenticated$ = resolve(AuthService).isAuthenticated();
  protected showPlaceOrderButton$ = combineLatest([
    this.isGuestCheckout$,
    this.isAuthenticated$,
  ]).pipe(
    map(
      ([isGuestCheckout, isAuthenticated]) => isGuestCheckout || isAuthenticated
    )
  );

  submit(): void {
    this.checkout.placeOrder();
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.showPlaceOrderButton$,
      (showPlaceOrderButton) => {
        if (!showPlaceOrderButton) {
          return html``;
        }

        return html`<oryx-button @click="${this.submit}">
          <button>${i18n('checkout.place-order')}</button>
        </oryx-button>`;
      }
    )}`;
  }
}
