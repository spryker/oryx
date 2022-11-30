import { CheckoutPaymentService, PaymentMethod } from '@spryker-oryx/checkout';
import { ComponentMixin } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { styles } from './payment-selector.styles';

@hydratable('window:load')
export class CheckoutPaymentSelectorComponent extends ComponentMixin() {
  static styles = styles;

  protected service = resolve(CheckoutPaymentService);
  protected methods$ = this.service.getMethods();
  protected currentMethod$ = new BehaviorSubject<string | null>(null);

  protected override render(): TemplateResult {
    return html`${asyncValue(
      combineLatest([this.methods$, this.currentMethod$]),
      ([methods, currentMethod]) =>
        methods?.length
          ? html`${methods.map((method, i) =>
              this.renderMethod(
                method,
                currentMethod ? currentMethod === method.name : i === 0
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
          @change="${() => {
            this.currentMethod$.next(method.name);
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
