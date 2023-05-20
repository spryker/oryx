// import { CheckoutPaymentService } from '@spryker-oryx/checkout';
import { PaymentProviderType } from '@spryker-oryx/checkout/mocks';
// import { resolve } from '@spryker-oryx/di';
import { html, TemplateResult } from 'lit';

export const renderSelector = (type: PaymentProviderType): TemplateResult => {
  // const paymentService = resolve(
  //   CheckoutPaymentService
  // ) as unknown as MockPaymentService;
  // paymentService.changeProviderType(type);
  return html`<oryx-checkout-payment></oryx-checkout-payment>`;
};
