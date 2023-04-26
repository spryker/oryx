import {
  CheckoutDataService,
  CheckoutOrchestrationService,
  CheckoutPaymentService,
  CheckoutStepType,
  CheckoutTrigger,
  PaymentMethod,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ComponentMixin } from '@spryker-oryx/experience';
import {
  asyncValue,
  hydratable,
  i18n,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { styles } from './payment.styles';

@hydratable('window:load')
export class CheckoutPaymentComponent extends ComponentMixin() {
  static styles = styles;

  protected service = resolve(CheckoutPaymentService);
  protected orchestrationService = resolve(CheckoutOrchestrationService);
  protected dataService = resolve(CheckoutDataService);

  protected methods$ = this.service.getMethods();
  protected currentMethod$ = new BehaviorSubject<string | null>(null);
  protected selectedPaymentMethod$ = this.dataService
    .getPayment()
    .pipe(map((method) => method?.id));

  // TODO: consider moving to effect whenever component life cycle is supported
  @subscribe()
  protected triggerValidation = this.orchestrationService
    .getTrigger(CheckoutStepType.Payment)
    .pipe(tap((trigger) => this.submit(trigger)));

  submit(action: CheckoutTrigger): void {
    const selected =
      this.renderRoot.querySelector<HTMLInputElement>('input[checked]');

    if (selected) {
      // TODO: avoid subscribing
      this.service.setPaymentMethod(selected.value).subscribe();
    }

    if (action === CheckoutTrigger.Check) {
      this.orchestrationService.report(CheckoutStepType.Payment, !!selected);
    }
  }

  protected override render(): TemplateResult {
    return html` ${asyncValue(
      combineLatest([
        this.methods$,
        this.selectedPaymentMethod$,
        this.currentMethod$,
      ]),
      ([methods, selectedPaymentMethod, currentMethod]) =>
        methods?.length
          ? html` <h3>${i18n('checkout.steps.payment')}</h3>
              ${methods.map((method, i) =>
                this.renderMethod(
                  method,
                  currentMethod
                    ? currentMethod === method.id
                    : !selectedPaymentMethod
                    ? i === 0
                    : selectedPaymentMethod === method.id
                )
              )}`
          : this.renderEmpty()
    )}`;
  }

  protected renderMethod(
    method: PaymentMethod,
    selected: boolean
  ): TemplateResult {
    return html`<oryx-tile ?selected="${selected}">
      <oryx-radio>
        <input
          name="payment-method"
          type="radio"
          ?checked="${selected}"
          .value="${method.id}"
          @change="${() => {
            this.currentMethod$.next(method.id);
            // this.orchestrationService.report(CheckoutStepType.Payment, true);
          }}"
        />
        ${method.name}
        <small slot="subtext">
          ${i18n('checkout.payment.select-<method>', {
            method: method.name,
          })}
        </small>
      </oryx-radio>
    </oryx-tile>`;
  }

  protected renderEmpty(): TemplateResult {
    return html`<p class="no-methods">
      ${i18n('checkout.payment.no-methods-available')}
    </p>`;
  }
}
