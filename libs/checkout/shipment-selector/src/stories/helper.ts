import { CheckoutShipmentService } from '@spryker-oryx/checkout';
import {
  MockShipmentService,
  ProviderType,
} from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/injector';
import { html, TemplateResult } from 'lit';

export const renderSelector = (type: ProviderType): TemplateResult => {
  const shipmentService = resolve(
    CheckoutShipmentService
  ) as unknown as MockShipmentService;
  shipmentService.changeProviderType(type);
  return html`<checkout-shipment-selector></checkout-shipment-selector>`;
};
