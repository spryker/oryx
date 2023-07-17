import { CheckoutMixin, isValid, PaymentMethod } from '@spryker-oryx/checkout';
import { hydrate, I18nMixin, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { styles } from './payment-method.styles';

@hydrate({ event: 'window:load' })
export class CheckoutPaymentMethodComponent
  extends I18nMixin(CheckoutMixin(LitElement))
  implements isValid
{
  static styles = styles;

  protected paymentMethods = signal(
    this.checkoutDataService.get('paymentMethods')
  );
  protected selected = signal(this.checkoutStateService.get('payments'));

  @query('form')
  protected form?: HTMLFormElement;

  isValid(report: boolean): boolean {
    if (!this.form?.checkValidity() && report) {
      this.form?.reportValidity();
    }
    return !!this.form?.checkValidity();
  }

  protected override render(): TemplateResult | void {
    const methods = this.paymentMethods();

    if (!methods?.length) return this.renderEmpty();

    return html`<oryx-checkout-header>
        <h2>${this.i18n('checkout.payment-methods')}</h2>
      </oryx-checkout-header>
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
          ${this.i18n('checkout.payment.select-<method>', {
            method: method.name,
          })}
        </span>
      </oryx-radio>
    </oryx-tile>`;
  }

  /**
   * Evaluates whether the given method id is the selected method.
   * If there's no method selected, a method can be auto selected.
   */
  protected isSelected(methodId: string): boolean {
    if (!this.selected()) this.autoSelect(methodId);
    return this.selected()?.[0]?.id === methodId;
  }

  protected onChange(e: Event): void {
    const id = (e.target as HTMLInputElement).value;
    this.select(id);
  }

  protected autoSelect(methodId: string): void {
    if (methodId === this.paymentMethods()?.[0]?.id) {
      this.select(methodId);
    }
  }

  protected select(id: string): void {
    const method = this.paymentMethods()?.find((method) => method.id === id);
    this.checkoutStateService.set('payments', {
      value: [method],
      valid: true,
    });
  }

  protected renderEmpty(): TemplateResult {
    return html`<p class="no-methods">
      ${this.i18n('checkout.payment.no-methods-available')}
    </p>`;
  }
}
