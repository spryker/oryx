import { AuthService } from '@spryker-oryx/auth';
import { CheckoutDataService, CheckoutService } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ComponentMixin } from '@spryker-oryx/experience';
import { asyncValue, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@hydratable('window:load')
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

  protected isBusy$ = new BehaviorSubject(false);

  submit(): void {
    this.isBusy$.next(true);
    this.checkout.placeOrder().subscribe({
      complete: () => {
        this.isBusy$.next(false);
      },
      error: () => {
        this.isBusy$.next(false);
      },
    });
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.showPlaceOrderButton$,
      (showPlaceOrderButton) => {
        if (!showPlaceOrderButton) {
          return html``;
        }

        return html`<oryx-button
          ?loading=${asyncValue(this.isBusy$)}
          @click="${this.submit}"
        >
          <button ?inert=${asyncValue(this.isBusy$)}>
            ${i18n('checkout.place-order')}
          </button>
        </oryx-button>`;
      }
    )}`;
  }
}
