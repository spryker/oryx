import { featureVersion } from '@spryker-oryx/utilities';
import * as services from '../services/src/index';

const reexports: typeof services =
  featureVersion < '1.1' ? services : (undefined as any);

/** @deprecated since 1.1, use DefaultCartService from @spryker-oryx/cart/services */
export const DefaultCheckoutService = reexports?.DefaultCheckoutService;
/** @deprecated since 1.1, use DefaultCheckoutAdapter from @spryker-oryx/cart/services */
export const DefaultCheckoutAdapter = reexports?.DefaultCheckoutAdapter;
/** @deprecated since 1.1, use DefaultCheckoutDataService from @spryker-oryx/cart/services */
export const DefaultCheckoutDataService = reexports?.DefaultCheckoutDataService;
/** @deprecated since 1.1, use DefaultCheckoutStateService from @spryker-oryx/cart/services */
export const DefaultCheckoutStateService =
  reexports?.DefaultCheckoutStateService;
/** @deprecated since 1.1, use checkoutAttributesNormalizer from @spryker-oryx/cart/services */
export const checkoutAttributesNormalizer =
  reexports?.checkoutAttributesNormalizer;
/** @deprecated since 1.1, use checkoutShipmentsNormalizer from @spryker-oryx/cart/services */
export const checkoutShipmentsNormalizer =
  reexports?.checkoutShipmentsNormalizer;
/** @deprecated since 1.1, use checkoutPaymentsNormalizer from @spryker-oryx/cart/services */
export const checkoutPaymentsNormalizer = reexports?.checkoutPaymentsNormalizer;
/** @deprecated since 1.1, use  from @spryker-oryx/cart/services */
export const checkoutCartsNormalizer = reexports?.checkoutCartsNormalizer;
/** @deprecated since 1.1, use checkoutResponseAttributesNormalizer from @spryker-oryx/cart/services */
export const checkoutResponseAttributesNormalizer =
  reexports?.checkoutResponseAttributesNormalizer;
/** @deprecated since 1.1, use paymentsNormalizer from @spryker-oryx/cart/services */
export const paymentsNormalizer = reexports?.paymentsNormalizer;
/** @deprecated since 1.1, use shipmentsNormalizer from @spryker-oryx/cart/services */
export const shipmentsNormalizer = reexports?.shipmentsNormalizer;
/** @deprecated since 1.1, use checkoutAttributesSerializer from @spryker-oryx/cart/services */
export const checkoutAttributesSerializer =
  reexports?.checkoutAttributesSerializer;
/** @deprecated since 1.1, use checkoutDataAttributesSerializer from @spryker-oryx/cart/services */
export const checkoutDataAttributesSerializer =
  reexports?.checkoutDataAttributesSerializer;
