import { AuthService } from '@spryker-oryx/auth';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutOrchestrationService,
  CheckoutStep,
  CheckoutStepType,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { AddressService } from '@spryker-oryx/user';
import { asyncValue, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { combineLatest, map } from 'rxjs';
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
  protected hasAddresses$ = resolve(AddressService)
    .getAddresses()
    .pipe(map((addresses) => !!addresses?.length));
  protected isGuestCheckout$ = this.checkoutDataService.isGuestCheckout();

  protected steps$ = this.orchestrationService.getValidity();

  protected checkout$ = combineLatest([
    this.isEmptyCart$,
    this.isAuthenticated$,
    this.isGuestCheckout$,
    this.hasAddresses$,
    this.options$,
  ]);

  protected override render(): TemplateResult {
    return html` ${asyncValue(
      this.checkout$,
      ([
        isEmptyCart,
        isAuthenticated,
        isGuestCheckout,
        hasAddresses,
        options,
      ]) => {
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
                        ${this.renderHeading(
                          index,
                          id,
                          isAuthenticated,
                          hasAddresses
                        )}
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
    step: CheckoutStepType,
    isAuthenticated: boolean,
    hasAddresses: boolean
  ): TemplateResult {
    return html`
      <oryx-heading slot="header">
        <h5>
          ${asyncValue(
            this.orchestrationService.getStep(step),
            (step: Required<CheckoutStep> | null) =>
              step
                ? html`${i18n(step.label, { step: `${index + 1}.` })}`
                : html``
          )}
        </h5>
      </oryx-heading>

      ${when(
        step === CheckoutStepType.Delivery && isAuthenticated && hasAddresses,
        () => html`<oryx-checkout-manage-address
          slot="header"
        ></oryx-checkout-manage-address>`
      )}
    `;
  }
}
