import { CheckoutAdapter, DefaultCheckoutAdapter } from './adapter';
import {
  checkoutNormalizer,
  ShipmentsNormalizer,
  shipmentsNormalizer,
} from './adapter/normalizers';
import { checkoutSerializer } from './adapter/serializers';
import { CheckoutDataService } from './checkout-data.service';
import { CheckoutShipmentService } from './checkout-shipment.service';
import { componentsProvider } from './components.provider';
import { DefaultCheckoutDataService } from './default-checkout-data.service';
import { DefaultCheckoutShipmentService } from './default-checkout-shipment.service';
import { DefaultCheckoutOrchestrationService } from './default-orchestration.service';
import { CheckoutOrchestrationService } from './orchestration.service';

export const checkoutProviders = [
  componentsProvider,
  {
    provide: CheckoutAdapter,
    useClass: DefaultCheckoutAdapter,
  },
  {
    provide: CheckoutDataService,
    useClass: DefaultCheckoutDataService,
  },
  {
    provide: CheckoutShipmentService,
    useClass: DefaultCheckoutShipmentService,
  },
  {
    provide: ShipmentsNormalizer,
    useValue: shipmentsNormalizer,
  },
  {
    provide: CheckoutOrchestrationService,
    useClass: DefaultCheckoutOrchestrationService,
  },
  ...checkoutSerializer,
  ...checkoutNormalizer,
];
