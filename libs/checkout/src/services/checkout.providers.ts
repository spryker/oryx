import { CheckoutAdapter, DefaultCheckoutAdapter } from './adapter';
import {
  checkoutNormalizer,
  ShipmentsNormalizer,
  shipmentsNormalizer,
} from './adapter/normalizers';
import { checkoutSerializer } from './adapter/serializers';
import { CheckoutService } from './checkout.service';
import { componentsProvider } from './components.provider';
import { DefaultCheckoutService } from './default-checkout.service';

export const checkoutProviders = [
  componentsProvider,
  {
    provide: CheckoutAdapter,
    useClass: DefaultCheckoutAdapter,
  },
  {
    provide: CheckoutService,
    useClass: DefaultCheckoutService,
  },
  {
    provide: ShipmentsNormalizer,
    useValue: shipmentsNormalizer,
  },
  ...checkoutSerializer,
  ...checkoutNormalizer,
];
