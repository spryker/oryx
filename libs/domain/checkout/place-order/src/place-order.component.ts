import { CheckoutService } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ComponentMixin } from '@spryker-oryx/experience';
import { i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';

export class CheckoutPlaceOrderComponent extends ComponentMixin() {
  protected checkout = resolve(CheckoutService);

  submit(): void {
    this.checkout.placeOrder();
  }

  protected override render(): TemplateResult {
    return html`<oryx-button @click="${this.submit}"
      ><button>${i18n('checkout.place-order')}</button></oryx-button
    >`;
  }
}
