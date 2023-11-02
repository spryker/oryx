import { featureVersion } from '@spryker-oryx/utilities';
import * as services from '../services/src/index';

const reexports: typeof services =
  featureVersion < '1.2' ? services : (undefined as any);

/** @deprecated since 1.2, use DefaultCheckoutService from @spryker-oryx/checkout/services */
export const DefaultCheckoutService = reexports?.DefaultCheckoutService;
/** @deprecated since 1.2, use DefaultCheckoutAdapter from @spryker-oryx/checkout/services */
export const DefaultCheckoutAdapter = reexports?.DefaultCheckoutAdapter;
/** @deprecated since 1.2, use DefaultCheckoutDataService from @spryker-oryx/checkout/services */
export const DefaultCheckoutDataService = reexports?.DefaultCheckoutDataService;
/** @deprecated since 1.2, use DefaultCheckoutStateService from @spryker-oryx/checkout/services */
export const DefaultCheckoutStateService =
  reexports?.DefaultCheckoutStateService;
/** @deprecated since 1.2, use checkoutAttributesNormalizer from @spryker-oryx/checkout/services */
export const checkoutAttributesNormalizer =
  reexports?.checkoutAttributesNormalizer;
/** @deprecated since 1.2, use checkoutShipmentsNormalizer from @spryker-oryx/checkout/services */
export const checkoutShipmentsNormalizer =
  reexports?.checkoutShipmentsNormalizer;
/** @deprecated since 1.2, use checkoutPaymentsNormalizer from @spryker-oryx/checkout/services */
export const checkoutPaymentsNormalizer = reexports?.checkoutPaymentsNormalizer;
/** @deprecated since 1.2, use  from @spryker-oryx/checkout/services */
export const checkoutCartsNormalizer = reexports?.checkoutCartsNormalizer;
/** @deprecated since 1.2, use checkoutResponseAttributesNormalizer from @spryker-oryx/checkout/services */
export const checkoutResponseAttributesNormalizer =
  reexports?.checkoutResponseAttributesNormalizer;
/** @deprecated since 1.2, use paymentsNormalizer from @spryker-oryx/checkout/services */
export const paymentsNormalizer = reexports?.paymentsNormalizer;
/** @deprecated since 1.2, use shipmentsNormalizer from @spryker-oryx/checkout/services */
export const shipmentsNormalizer = reexports?.shipmentsNormalizer;
/** @deprecated since 1.2, use checkoutAttributesSerializer from @spryker-oryx/checkout/services */
export const checkoutAttributesSerializer =
  reexports?.checkoutAttributesSerializer;
/** @deprecated since 1.2, use checkoutDataAttributesSerializer from @spryker-oryx/checkout/services */
export const checkoutDataAttributesSerializer =
  reexports?.checkoutDataAttributesSerializer;
