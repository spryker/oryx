import { CheckoutAdapter, DefaultCheckoutAdapter } from './adapter';
import {
  CheckoutNormalizers,
  checkoutNormalizers,
  ShipmentsNormalizers,
  shipmentsNormalizers,
} from './adapter/normalizers';
import {
  CheckoutSerializers,
  checkoutSerializers,
} from './adapter/serializers';
import { CheckoutService } from './checkout.service';
import { DefaultCheckoutService } from './default-checkout.service';

export const checkoutProviders = [
  {
    provide: CheckoutAdapter,
    useClass: DefaultCheckoutAdapter,
  },
  {
    provide: CheckoutService,
    useClass: DefaultCheckoutService,
  },
  {
    provide: CheckoutSerializers,
    useValue: checkoutSerializers,
  },
  {
    provide: CheckoutNormalizers,
    useValue: checkoutNormalizers,
  },
  {
    provide: ShipmentsNormalizers,
    useValue: shipmentsNormalizers,
  },
];
