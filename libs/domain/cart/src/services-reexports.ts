import { featureVersion } from '@spryker-oryx/utilities';
import * as services from '../services/src/index';

const reexports: typeof services =
  featureVersion < '1.2' ? services : (undefined as any);

/** @deprecated since 1.2, use DefaultCartService from @spryker-oryx/cart/services */
export const DefaultCartService = reexports?.DefaultCartService;
/** @deprecated since 1.2, use DefaultCartAdapter from @spryker-oryx/cart/services */
export const DefaultCartAdapter = reexports?.DefaultCartAdapter;
/** @deprecated since 1.2, use DefaultTotalsService from @spryker-oryx/cart/services */
export const DefaultTotalsService = reexports?.DefaultTotalsService;
/** @deprecated since 1.2, use cartAttributesNormalizer from @spryker-oryx/cart/services */
export const cartAttributesNormalizer = reexports?.cartAttributesNormalizer;
/** @deprecated since 1.2, use cartsItemsNormalizer from @spryker-oryx/cart/services */
export const cartsItemsNormalizer = reexports?.cartsItemsNormalizer;
