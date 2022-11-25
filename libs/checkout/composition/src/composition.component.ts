import { AuthService } from '@spryker-oryx/auth';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutOrchestrationService,
  Validity,
} from '@spryker-oryx/checkout';
import { ComponentMixin } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue, subscribe } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { combineLatest, map } from 'rxjs';
import { styles } from './composition.styles';

@hydratable('window:load')
export class CheckoutCompositionComponent extends ComponentMixin() {
  static styles = styles;

  protected checkoutDataService = resolve(CheckoutDataService);

  protected orchestrationService = resolve(CheckoutOrchestrationService);

  protected isEmptyCart$ = resolve(CartService).isEmpty();

  protected isAuthenticated$ = resolve(AuthService).isAuthenticated();
  protected isGuestCheckout$ = this.checkoutDataService.isGuestCheckout();

  @subscribe()
  protected steps$ = this.orchestrationService.getValidity();

  protected deliveryCompleted$ = this.steps$.pipe(
    map((steps) => {
      return !!(
        steps.find((step) => step.id === 'delivery')?.validity ===
        Validity.Valid
      );
    })
  );

  //just for preview. Need to drop after implementation of additional steps
  protected testData$ = combineLatest([
    this.checkoutDataService.getContactDetails(),
    this.checkoutDataService.getAddressDetails(),
  ]);

  protected checkout$ = combineLatest([
    this.isEmptyCart$,
    this.isAuthenticated$,
    this.isGuestCheckout$,
    this.deliveryCompleted$,
    this.testData$,
  ]);

  protected renderGuestCheckoutHeading(): TemplateResult {
    return html`
      <header>
        <h1>${i18n('checkout.guest-checkout')}</h1>

        <oryx-button type="text">
          <button
            @click=${(): void => {
              this.checkoutDataService.setIsGuestCheckout(false);
            }}
          >
            ${i18n('checkout.checkout-as-register')}
          </button>
        </oryx-button>
      </header>
    `;
  }

  protected override render(): TemplateResult {
    return html` <!-- TODO: just for demonstration -->
      ${asyncValue(
        this.steps$,
        (steps) => html`
          <ul>
            ${steps.map(
              ({ id, validity }) => html` <li>${id}: ${validity}</li> `
            )}
          </ul>
        `
      )}
      ${asyncValue(
        this.checkout$,
        ([
          isEmptyCart,
          isAuthenticated,
          isGuestCheckout,
          deliveryCompleted,
          testData,
        ]) => {
          if (isEmptyCart) {
            return html``;
          }

          if (!(isAuthenticated || isGuestCheckout)) {
            return html`
              <checkout-login
                @oryx.guest-submit=${(): void => {
                  this.checkoutDataService.setIsGuestCheckout();
                }}
              ></checkout-login>
            `;
          }

          return html`
            ${when(
              isGuestCheckout,
              () => html`${this.renderGuestCheckoutHeading()}`
            )}
            ${when(
              deliveryCompleted,
              () => html`
                <h3>2. Shipping</h3>
                <p style="word-break: break-all;">
                  ${JSON.stringify(testData[0])}
                </p>

                <p style="word-break: break-all;">
                  ${JSON.stringify(testData[1])}
                </p>
              `,
              () => html` <checkout-delivery></checkout-delivery> `
            )}
          `;
        }
      )}`;
  }
}
