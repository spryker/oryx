import { Provider } from '@spryker-oryx/di';
import {
  checkoutAttributesNormalizer,
  checkoutCartsNormalizer,
  checkoutPaymentsNormalizer,
  checkoutResponseAttributesNormalizer,
  checkoutShipmentsNormalizer,
  paymentsNormalizer,
  shipmentsNormalizer,
} from '../../services/src/adapter/normalizers';
import {
  CheckoutAdapter,
  CheckoutDataSerializer,
  CheckoutNormalizer,
  CheckoutResponseNormalizer,
  CheckoutSerializer,
  PaymentsNormalizer,
  ShipmentsNormalizer,
} from './adapter';

import {
  DefaultCheckoutAdapter,
  DefaultCheckoutDataService,
  DefaultCheckoutService,
  DefaultCheckoutStateService,
} from '@spryker-oryx/checkout/services';
import { featureVersion } from '@spryker-oryx/utilities';
import {
  checkoutAttributesSerializer,
  checkoutDataAttributesSerializer,
} from '../../services/src/adapter/serializers';
import { CheckoutService } from './checkout.service';
import { CheckoutDataService } from './data';
import { CheckoutStateService } from './state';

export const checkoutNormalizer: Provider[] = [
  {
    provide: CheckoutNormalizer,
    useValue: checkoutAttributesNormalizer,
  },
  {
    provide: CheckoutNormalizer,
    useValue: checkoutShipmentsNormalizer,
  },
  {
    provide: CheckoutNormalizer,
    useValue: checkoutPaymentsNormalizer,
  },
  {
    provide: CheckoutNormalizer,
    useValue: checkoutCartsNormalizer,
  },
];

export const checkoutSerializer: Provider[] = [
  {
    provide: CheckoutSerializer,
    useValue: checkoutAttributesSerializer,
  },
];

export const checkoutDataSerializer: Provider[] = [
  {
    provide: CheckoutDataSerializer,
    useValue: checkoutDataAttributesSerializer,
  },
];

export const checkoutResponseNormalizer: Provider[] = [
  {
    provide: CheckoutResponseNormalizer,
    useValue: checkoutResponseAttributesNormalizer,
  },
];

export const checkoutProviders =
  featureVersion < '1.1'
    ? [
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
      ]
    : [
        {
          provide: CheckoutService,
          asyncClass: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.DefaultCheckoutService
            ),
        },
        {
          provide: CheckoutDataService,
          asyncClass: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.DefaultCheckoutDataService
            ),
        },
        {
          provide: CheckoutStateService,
          asyncClass: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.DefaultCheckoutStateService
            ),
        },
        {
          provide: CheckoutAdapter,
          asyncClass: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.DefaultCheckoutAdapter
            ),
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
