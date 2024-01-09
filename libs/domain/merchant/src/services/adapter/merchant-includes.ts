import { provideIncludes } from '@spryker-oryx/core';
import { PRODUCT } from '@spryker-oryx/product';
import { ApiMerchantModel } from '../../models';

export const merchantProductIncludes = provideIncludes(PRODUCT, [
  ApiMerchantModel.Includes.ProductOffers,
  ApiMerchantModel.Includes.ProductOfferPrices,
  ApiMerchantModel.Includes.ProductOfferAvailabilities,
  ApiMerchantModel.Includes.Merchants,
]);

export const merchantIncludes = [...merchantProductIncludes];
