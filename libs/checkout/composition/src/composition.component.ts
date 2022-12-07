import { AuthService } from '@spryker-oryx/auth';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutOrchestrationService,
  CheckoutStepType,
} from '@spryker-oryx/checkout';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue, subscribe } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { combineLatest } from 'rxjs';
import { CheckoutCompositionOptions } from './composition.model';
import { compositionStyles } from './composition.styles';

@hydratable('window:load')
export class CheckoutCompositionComponent extends ComponentMixin<CheckoutCompositionOptions>() {
  static styles = compositionStyles;

  protected checkoutDataService = resolve(CheckoutDataService);

  protected orchestrationService = resolve(CheckoutOrchestrationService);

  protected options$ = new ContentController(this).getOptions();

  protected isEmptyCart$ = resolve(CartService).isEmpty();

  protected isAuthenticated$ = resolve(AuthService).isAuthenticated();
  protected isGuestCheckout$ = this.checkoutDataService.isGuestCheckout();

  @subscribe()
  protected steps$ = this.orchestrationService.getValidity();

  protected checkout$ = combineLatest([
    this.isEmptyCart$,
    this.isAuthenticated$,
    this.isGuestCheckout$,
    this.options$,
  ]);

  protected renderGuestCheckoutHeading(): TemplateResult {
    return html`
      <oryx-heading>
        <h3>${i18n('checkout.guest-checkout')}</h3>
        <oryx-button type="text">
          <button
            @click=${(): void => {
              this.checkoutDataService.setIsGuestCheckout(false);
            }}
          >
            ${i18n('checkout.checkout-as-register')}
          </button>
        </oryx-button>
      </oryx-heading>
    `;
  }

  protected renderStep(step: CheckoutStepType): TemplateResult {
    switch (step) {
      case CheckoutStepType.Shipping:
        return html`<checkout-shipment></checkout-shipment>`;
      case CheckoutStepType.Payment:
        return html`<checkout-payment></checkout-payment>`;
      default:
        return html``;
    }
  }

  protected override render(): TemplateResult {
    return html` ${asyncValue(
      this.steps$,
      (steps) => html`
        ${steps.map(({ id, validity }, index) => {
          return html`
            <oryx-card>
              <h2 slot="header">${index + 1}. ${id}</h2>
              <slot name="content"
                >${this.renderStep(id as CheckoutStepType)}</slot
              >
            </oryx-card>
          `;
        })}
      `
    )}
    ${asyncValue(
      this.checkout$,
      ([isEmptyCart, isAuthenticated, isGuestCheckout, options]) => {
        if (isEmptyCart) {
          return html``;
        }

        if (!(isAuthenticated || isGuestCheckout)) {
          return html`
            <checkout-login
              @oryx.guest-submit=${(): void => {
                this.checkoutDataService.setIsGuestCheckout();
              }}
              .options=${{ disableGuest: options.disableGuest }}
            ></checkout-login>
          `;
        }

        return html`
          ${when(
            isGuestCheckout,
            () => html`${this.renderGuestCheckoutHeading()}`
          )}
          <checkout-delivery></checkout-delivery>
        `;
      }
    )}`;
  }
}
