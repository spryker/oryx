// import { CheckoutShipmentService } from '@spryker-oryx/checkout';
import { ShipmentProviderType } from '@spryker-oryx/checkout/mocks';
// import { resolve } from '@spryker-oryx/di';
import { html, TemplateResult } from 'lit';

export const renderSelector = (type: ShipmentProviderType): TemplateResult => {
  // const shipmentService = resolve(
  //   CheckoutShipmentService
  // ) as unknown as MockShipmentService;
  // shipmentService.changeProviderType(type);
  return html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`;
};
