import { Provider } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import {
  CheckoutAdapter,
  CheckoutDataSerializer,
  CheckoutDataService,
  CheckoutNormalizer,
  CheckoutResponseNormalizer,
  CheckoutSerializer,
  CheckoutService,
  CheckoutStateService,
  PaymentsNormalizer,
  ShipmentsNormalizer,
} from './services';
import {
  DefaultCheckoutAdapter,
  DefaultCheckoutDataService,
  DefaultCheckoutService,
  DefaultCheckoutStateService,
  checkoutAttributesNormalizer,
  checkoutAttributesSerializer,
  checkoutCartsNormalizer,
  checkoutDataAttributesSerializer,
  checkoutPaymentsNormalizer,
  checkoutResponseAttributesNormalizer,
  checkoutShipmentsNormalizer,
  paymentsNormalizer,
  shipmentsNormalizer,
} from './services-reexports';

export const checkoutNormalizer: Provider[] =
  featureVersion < '1.1'
    ? [
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
      ]
    : [
        {
          provide: CheckoutNormalizer,
          useValue: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.checkoutAttributesNormalizer
            ),
        },
        {
          provide: CheckoutNormalizer,
          useValue: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.checkoutShipmentsNormalizer
            ),
        },
        {
          provide: CheckoutNormalizer,
          useValue: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.checkoutPaymentsNormalizer
            ),
        },
        {
          provide: CheckoutNormalizer,
          useValue: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.checkoutCartsNormalizer
            ),
        },
      ];

export const checkoutSerializer: Provider[] =
  featureVersion < '1.1'
    ? [
        {
          provide: CheckoutSerializer,
          useValue: checkoutAttributesSerializer,
        },
      ]
    : [
        {
          provide: CheckoutSerializer,
          useValue: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.checkoutAttributesSerializer
            ),
        },
      ];

export const checkoutDataSerializer: Provider[] =
  featureVersion < '1.1'
    ? [
        {
          provide: CheckoutDataSerializer,
          useValue: checkoutDataAttributesSerializer,
        },
      ]
    : [
        {
          provide: CheckoutDataSerializer,
          useValue: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.checkoutDataAttributesSerializer
            ),
        },
      ];

export const checkoutResponseNormalizer: Provider[] =
  featureVersion < '1.1'
    ? [
        {
          provide: CheckoutResponseNormalizer,
          useValue: checkoutResponseAttributesNormalizer,
        },
      ]
    : [
        {
          provide: CheckoutResponseNormalizer,
          useValue: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.checkoutResponseAttributesNormalizer
            ),
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
          useValue: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.shipmentsNormalizer
            ),
        },
        {
          provide: PaymentsNormalizer,
          useValue: () =>
            import('@spryker-oryx/checkout/services').then(
              (m) => m.paymentsNormalizer
            ),
        },
        ...checkoutDataSerializer,
        ...checkoutSerializer,
        ...checkoutNormalizer,
        ...checkoutResponseNormalizer,
      ];
