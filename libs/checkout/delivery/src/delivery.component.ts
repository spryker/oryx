import { AuthService } from '@spryker-oryx/auth';
import {
  CheckoutForm,
  CheckoutOrchestrationService,
  CheckoutStepType,
  CheckoutTrigger,
} from '@spryker-oryx/checkout';
import { ComponentMixin } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue, subscribe } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { tap } from 'rxjs';
import { styles } from './delivery.styles';

export class CheckoutDeliveryComponent extends ComponentMixin() {
  static styles = styles;

  protected isAuthenticated$ = resolve(AuthService).isAuthenticated();

  protected orchestrationService = resolve(CheckoutOrchestrationService);

  @subscribe()
  protected submitTrigger$ = this.orchestrationService
    .getTrigger(CheckoutStepType.Delivery)
    .pipe(
      tap((trigger) => {
        console.log(trigger);

        if (trigger === CheckoutTrigger.Check) {
          this.checkAndSubmit();
        }

        if (trigger === CheckoutTrigger.Report) {
          this.report();
        }
      })
    );

  protected get forms(): NodeListOf<CheckoutForm & Element> {
    return this.renderRoot.querySelectorAll<CheckoutForm & Element>(
      'section > *'
    );
  }

  protected checkAndSubmit(): void {
    let isValid = true;

    for (const form of this.forms) {
      if (!form.submit()) {
        isValid = false;
      }
    }

    this.orchestrationService.report(CheckoutStepType.Delivery, isValid);
  }

  protected report(): void {
    for (const form of this.forms) {
      if (!form.submit(true)) {
        break;
      }
    }
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.isAuthenticated$,
      (isAuthenticated) => html`
        <h3>${i18n('checkout.delivery-details')}</h3>

        <section>
          ${when(
            !isAuthenticated,
            () => html`<checkout-contact></checkout-contact>`
          )}
          <checkout-address></checkout-address>
        </section>

        <oryx-button>
          <button
            @click=${(): void =>
              this.orchestrationService.submit(CheckoutStepType.Delivery)}
          >
            ${i18n('checkout.use-this-address')}
          </button>
        </oryx-button>
      `
    )}`;
  }
}
