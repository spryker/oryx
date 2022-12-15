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
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
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

  protected steps$ = this.orchestrationService.getValidity();

  protected checkout$ = combineLatest([
    this.isEmptyCart$,
    this.isAuthenticated$,
    this.isGuestCheckout$,
    this.options$,
  ]);

  protected renderStep(step: CheckoutStepType): TemplateResult {
    switch (step) {
      case CheckoutStepType.Delivery:
        return html` <checkout-delivery></checkout-delivery>`;
      case CheckoutStepType.Shipping:
        return html`<checkout-shipment></checkout-shipment>`;
      case CheckoutStepType.Payment:
        return html`<checkout-payment></checkout-payment>`;
      default:
        return html``;
    }
  }

  protected renderHeading(
    index: number,
    step: CheckoutStepType
  ): TemplateResult {
    const heading = html` <oryx-heading slot="header">
      <h5>${index + 1}. ${step}</h5>
    </oryx-heading>`;

    switch (step) {
      case CheckoutStepType.Delivery:
        return html`
          ${heading}
          <oryx-checkout-manage-address
            slot="header"
          ></oryx-checkout-manage-address>
        `;
      default:
        return heading;
    }
  }

  protected override render(): TemplateResult {
    return html` ${asyncValue(
      this.checkout$,
      ([isEmptyCart, isAuthenticated, isGuestCheckout, options]) => {
        if (isEmptyCart) {
          return html``;
        }

        return html`
          <checkout-auth .options=${{ disableGuest: options.disableGuest }}>
          </checkout-auth>
          ${when(
            isAuthenticated || isGuestCheckout,
            () =>
              html`${asyncValue(
                this.steps$,
                (steps) => html`
                  ${steps.map(({ id, validity }, index) => {
                    return html`
                      <oryx-card>
                        ${this.renderHeading(index, id)}
                        <slot name="content"> ${this.renderStep(id)} </slot>
                      </oryx-card>
                    `;
                  })}
                `
              )}`
          )}
        `;
      }
    )}`;
  }
}
