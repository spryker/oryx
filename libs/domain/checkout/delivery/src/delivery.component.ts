import {
  CheckoutForm,
  CheckoutMixin,
  CheckoutStepType,
  CheckoutTrigger,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import {
  hydratable,
  i18n,
  signal,
  signalAware,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { tap } from 'rxjs';
import { styles } from './delivery.styles';

@signalAware()
@hydratable()
export class CheckoutDeliveryComponent extends CheckoutMixin(LitElement) {
  static styles = [styles];

  // TODO: consider moving to effect whenever component life cycle is supported
  @subscribe()
  protected triggerValidation = this.orchestrationService
    .getTrigger(CheckoutStepType.Delivery)
    .pipe(tap((trigger) => this.validate(trigger)));

  protected addresses = signal(resolve(AddressService).getAddresses());

  protected override render(): TemplateResult {
    return html`
      <h3>${i18n('checkout.steps.delivery')}</h3>
      ${when(
        this.isAuthenticated() && this.addresses()?.length,
        () =>
          html`<oryx-checkout-manage-address></oryx-checkout-manage-address>`
      )}
      ${when(
        this.isGuest() && !this.isAuthenticated(),
        () => html`<oryx-checkout-contact></oryx-checkout-contact>`
      )}
      <oryx-checkout-address></oryx-checkout-address>
    `;
  }

  protected validate(action?: CheckoutTrigger): void {
    let isValid = true;
    this.forms.forEach((el) => {
      if (isValid && !el.submit?.(true)) {
        isValid = false;
      }
    });
    if (action === CheckoutTrigger.Check) {
      this.orchestrationService.report(CheckoutStepType.Delivery, isValid);
    }
  }

  protected get forms(): NodeListOf<CheckoutForm> {
    return this.renderRoot.querySelectorAll<Element & CheckoutForm>(
      ':is(oryx-checkout-contact, oryx-checkout-address)'
    );
  }
}
