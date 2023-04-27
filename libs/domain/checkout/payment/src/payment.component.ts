import {
  CheckoutMixin,
  CheckoutPaymentService,
  CheckoutStepType,
  CheckoutTrigger,
  PaymentMethod,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { hydratable, i18n, signal, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { tap } from 'rxjs';
import { styles } from './payment.styles';

@hydratable('window:load')
export class CheckoutPaymentComponent extends CheckoutMixin(LitElement) {
  static styles = styles;

  protected paymentService = resolve(CheckoutPaymentService);

  protected methods = signal(this.paymentService.getMethods());
  protected selected = signal(this.paymentService.getSelected());

  // TODO: consider moving to effect whenever component life cycle is supported
  @subscribe()
  protected triggerValidation = this.orchestrationService
    .getTrigger(CheckoutStepType.Payment)
    .pipe(tap((trigger) => this.validate(trigger)));

  protected override render(): TemplateResult | void {
    const methods = this.methods();

    if (!methods?.length) return this.renderEmpty();

    return html`<h3>${i18n('checkout.steps.payment')}</h3>
      ${methods.map((method) => this.renderMethod(method))}`;
  }

  protected renderMethod(method: PaymentMethod): TemplateResult {
    const selected = this.isSelected(method.id);

    return html`<oryx-tile ?selected=${selected}>
      <oryx-radio>
        <input
          name="shipment-method"
          type="radio"
          value=${method.id}
          ?checked=${selected}
          @change=${this.onChange}
        />
        ${method.name}
        <span slot="subtext">
          ${i18n('checkout.payment.select-<method>', {
            method: method.name,
          })}
        </span>
      </oryx-radio>
    </oryx-tile>`;
  }

  // TODO: consider fallback strategies: none, first, cheapest
  protected isSelected(methodId: string): boolean {
    return this.selected()
      ? this.selected() === methodId
      : methodId === this.methods()?.[0]?.id;
  }

  protected validate(action: CheckoutTrigger): void {
    const selected = this.renderRoot.querySelector('input[checked]');
    if (action === CheckoutTrigger.Check) {
      this.orchestrationService.report(CheckoutStepType.Payment, !!selected);
    }
  }

  protected onChange(e: Event): void {
    const id = (e.target as HTMLInputElement).value;
    if (id && id !== this.selected()) {
      this.paymentService.setPaymentMethod(id).subscribe();
    }
  }

  protected renderEmpty(): TemplateResult {
    return html`<p class="no-methods">
      ${i18n('checkout.payment.no-methods-available')}
    </p>`;
  }
}
