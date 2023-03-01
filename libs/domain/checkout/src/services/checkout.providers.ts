import {
  CheckoutAdapter,
  checkoutResponseNormalizer,
  DefaultCheckoutAdapter,
} from './adapter';
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
import { CheckoutOrchestrationService } from './checkout-orchestration.service';
import { CheckoutPaymentService } from './checkout-payment.service';
import { CheckoutShipmentService } from './checkout-shipment.service';
import { CheckoutService } from './checkout.service';
import { DefaultCheckoutDataService } from './default-checkout-data.service';
import { DefaultCheckoutOrchestrationService } from './default-checkout-orchestration.service';
import { DefaultCheckoutPaymentService } from './default-checkout-payment.service';
import { DefaultCheckoutShipmentService } from './default-checkout-shipment.service';
import { DefaultCheckoutService } from './default-checkout.service';

export const checkoutProviders = [
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
  {
    provide: CheckoutService,
    useClass: DefaultCheckoutService,
  },
  ...checkoutDataSerializer,
  ...checkoutSerializer,
  ...checkoutNormalizer,
  ...checkoutResponseNormalizer,
];
