import {
  CheckoutComponentMixin,
  CheckoutForm,
  CheckoutStepType,
  CheckoutTrigger,
} from '@spryker-oryx/checkout';
import {
  hydratable,
  i18n,
  signalAware,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { tap } from 'rxjs';

@signalAware()
@hydratable()
export class CheckoutDeliveryComponent extends CheckoutComponentMixin(
  LitElement
) {
  // TODO: consider moving to effect whenever component life cycle is supported
  @subscribe()
  protected triggerValidation = this.orchestrationService
    .getTrigger(CheckoutStepType.Delivery)
    .pipe(tap((trigger) => this.submit(trigger)));

  protected override render(): TemplateResult {
    return html`
      <h3>${i18n('checkout.steps.delivery')}</h3>
      ${when(
        this.isGuest() && !this.isAuthenticated(),
        () => html`<checkout-contact></checkout-contact>`
      )}
      <checkout-address></checkout-address>
    `;
  }

  protected submit(action?: CheckoutTrigger): void {
    let valid = true;
    this.forms.forEach((el) => {
      if (valid && !el.submit?.(true)) {
        valid = false;
      }
    });
    if (action === CheckoutTrigger.Check) {
      this.orchestrationService.report(CheckoutStepType.Delivery, valid);
    }
  }

  protected get forms(): NodeListOf<CheckoutForm> {
    return this.renderRoot.querySelectorAll<Element & CheckoutForm>(
      ':is(checkout-contact, checkout-address)'
    );
  }
}
