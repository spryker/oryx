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
import { CheckoutService } from './checkout.service';
import { DefaultCheckoutService } from './default-checkout.service';
import {
  CheckoutPaymentService,
  DefaultCheckoutPaymentService,
} from './payment/';
import {
  CheckoutShipmentService,
  DefaultCheckoutShipmentService,
} from './shipment';

export const checkoutProviders = [
  {
    provide: CheckoutAdapter,
    useClass: DefaultCheckoutAdapter,
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
    provide: CheckoutService,
    useClass: DefaultCheckoutService,
  },
  ...checkoutDataSerializer,
  ...checkoutSerializer,
  ...checkoutNormalizer,
  ...checkoutResponseNormalizer,
];
