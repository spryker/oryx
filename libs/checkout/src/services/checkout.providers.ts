import { CheckoutAdapter, DefaultCheckoutAdapter } from './adapter';
import {
  checkoutNormalizer,
  ShipmentsNormalizer,
  shipmentsNormalizer,
} from './adapter/normalizers';
import { checkoutSerializer } from './adapter/serializers';
import { CheckoutShipmentService } from './checkout-shipment.service';
import { componentsProvider } from './components.provider';
import { DefaultCheckoutShipmentService } from './default-checkout-shipment.service';

export const checkoutProviders = [
  componentsProvider,
  {
    provide: CheckoutAdapter,
    useClass: DefaultCheckoutAdapter,
  },
  {
    provide: CheckoutShipmentService,
    useClass: DefaultCheckoutShipmentService,
  },
  {
    provide: ShipmentsNormalizer,
    useValue: shipmentsNormalizer,
  },
  ...checkoutSerializer,
  ...checkoutNormalizer,
];
