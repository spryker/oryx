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
import { CheckoutStateService } from './checkout-state.service';
import { CheckoutService } from './checkout.service';
import { DefaultCheckoutDataService } from './default-checkout-data.service';
import { DefaultCheckoutStateService } from './default-checkout-state.service';
import { DefaultCheckoutService } from './default-checkout.service';

export const checkoutProviders = [
  {
    provide: CheckoutService,
    useClass: DefaultCheckoutService,
  },
  {
    provide: CheckoutDataService,
    useClass: DefaultCheckoutDataService,
  },
  {
    provide: CheckoutStateService,
    useClass: DefaultCheckoutStateService,
  },
  {
    provide: CheckoutAdapter,
    useClass: DefaultCheckoutAdapter,
  },
  {
    provide: ShipmentsNormalizer,
    useValue: shipmentsNormalizer,
  },
  {
    provide: PaymentsNormalizer,
    useValue: paymentsNormalizer,
  },
  ...checkoutDataSerializer,
  ...checkoutSerializer,
  ...checkoutNormalizer,
  ...checkoutResponseNormalizer,
];
