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
import { when } from 'lit/directives/when.js';
import { combineLatest, map } from 'rxjs';
import { CheckoutCompositionOptions } from './composition.model';
import { compositionStyles } from './composition.styles';

@hydratable('window:load')
export class CheckoutCompositionComponent extends ComponentMixin<CheckoutCompositionOptions>() {
  static styles = compositionStyles;

  protected orchestrationService = resolve(CheckoutOrchestrationService);

  protected options$ = new ContentController(this).getOptions();

  protected isEmptyCart$ = resolve(CartService).isEmpty();

  protected isAuthenticated$ = resolve(AuthService).isAuthenticated();
  protected hasAddresses$ = resolve(AddressService)
    .getAddresses()
    .pipe(map((addresses) => !!addresses?.length));
  protected isGuestCheckout$ = resolve(CheckoutDataService).isGuestCheckout();

  protected steps$ = this.orchestrationService.getValidity();

  protected checkout$ = combineLatest([
    this.isEmptyCart$,
    this.isAuthenticated$,
    this.isGuestCheckout$,
    this.hasAddresses$,
    this.steps$,
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
        steps,
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
              html`
                ${steps.map(({ id }, index) => {
                  return html`${this.renderStep(
                    id,
                    this.renderHeading(index, id, isAuthenticated, hasAddresses)
                  )}`;
                })}
              `
          )}
        `;
      }
    )}`;
  }

  protected renderStep(
    step: CheckoutStepType,
    heading: TemplateResult
  ): TemplateResult {
    let content: TemplateResult = html``;

    switch (step) {
      case CheckoutStepType.Delivery:
        content = html` <checkout-delivery></checkout-delivery>`;
        break;
      case CheckoutStepType.Shipping:
        content = html`<checkout-shipment></checkout-shipment>`;
        break;
      case CheckoutStepType.Payment:
        content = html`<checkout-payment></checkout-payment>`;
        break;
    }

    return html`<section>${heading} ${content}</section>`;
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
        ${when(
          step === CheckoutStepType.Delivery && isAuthenticated && hasAddresses,
          () =>
            html`<oryx-checkout-manage-address></oryx-checkout-manage-address>`
        )}
      </oryx-heading>
    `;
  }
}
