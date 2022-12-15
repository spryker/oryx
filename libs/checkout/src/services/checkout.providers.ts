import { CheckoutAdapter, DefaultCheckoutAdapter } from './adapter';
import {
  checkoutNormalizer,
  PaymentsNormalizer,
  paymentsNormalizer,
  ShipmentsNormalizer,
  shipmentsNormalizer,
} from './adapter/normalizers';
import {
  checkoutDataSerializer,
  checkoutSerializer,
} from './adapter/serializers';
import { CheckoutDataService } from './checkout-data.service';
import { CheckoutPaymentService } from './checkout-payment.service';
import { CheckoutShipmentService } from './checkout-shipment.service';
import { componentsProvider } from './components.provider';
import { DefaultCheckoutDataService } from './default-checkout-data.service';
import { DefaultCheckoutPaymentService } from './default-checkout-payment.service';
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
    provide: CheckoutPaymentService,
    useClass: DefaultCheckoutPaymentService,
  },
  {
    provide: ShipmentsNormalizer,
    useValue: shipmentsNormalizer,
  },
  {
    provide: PaymentsNormalizer,
    useValue: paymentsNormalizer,
  },
  {
    provide: CheckoutOrchestrationService,
    useClass: DefaultCheckoutOrchestrationService,
  },
  ...checkoutDataSerializer,
  ...checkoutSerializer,
  ...checkoutNormalizer,
];
