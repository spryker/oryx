import {
  Checkout,
  CheckoutForm,
  CheckoutMixin,
  PaymentMethod,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { effect, hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query, state } from 'lit/decorators.js';
import { CheckoutDataService } from '../src/services/checkout-data.service';
import { styles } from './payment.styles';

@hydratable('window:load')
export class CheckoutPaymentComponent
  extends CheckoutMixin(LitElement)
  implements CheckoutForm
{
  static styles = styles;

  protected dataService = resolve(CheckoutDataService);
  protected paymentMethods = signal(this.dataService.get('paymentMethods'));
  protected selected = signal(this.dataService.selected('payments'));

  @state()
  selectedMethod?: Checkout['payments'] | null;

  @query('form')
  protected form?: HTMLFormElement;

  protected eff = effect(() => {
    // we need to set the validity when the data is resolvd from storage
    if (!this.selectedMethod && this.selected())
      this.dataService.set('payments', true);
    this.selectedMethod = this.selected();
  });

  validate(report: boolean): boolean {
    if (!this.form?.checkValidity() && report) {
      this.form?.reportValidity();
    }
    return !!this.form?.checkValidity();
  }

  protected override render(): TemplateResult | void {
    const methods = this.paymentMethods();

    if (!methods?.length) return this.renderEmpty();

    return html`<h3>${i18n('checkout.steps.payment')}</h3>
      <form>${methods.map((method) => this.renderMethod(method))}</form>`;
  }

  protected renderMethod(method: PaymentMethod): TemplateResult {
    const selected = this.isSelected(method.id);
    return html`<oryx-tile ?selected=${selected}>
      <oryx-radio>
        <input
          name="shipment-method"
          type="radio"
          value=${method.id}
          required
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

  /**
   * Evaluates whether the given method id is the seleced method.
   * If there's no method selected, a method can be auto selected.
   */
  protected isSelected(methodId: string): boolean {
    if (!this.selectedMethod) this.autoSelect(methodId);
    return this.selected()?.[0]?.id === methodId;
  }

  protected onChange(e: Event): void {
    const id = (e.target as HTMLInputElement).value;
    this.select(id);
  }

  // TODO: consider fallback strategies: none, first, cheapest, fastest
  protected autoSelect(methodId: string): void {
    if (methodId === this.paymentMethods()?.[0]?.id) {
      this.select(methodId);
    }
  }

  protected select(id?: string): void {
    const method = this.paymentMethods()?.find((method) => method.id === id);
    const data = method ? [method] : null;
    this.dataService.set('payments', !!this.form?.checkValidity, data);
  }

  protected renderEmpty(): TemplateResult {
    return html`<p class="no-methods">
      ${i18n('checkout.payment.no-methods-available')}
    </p>`;
  }
}
