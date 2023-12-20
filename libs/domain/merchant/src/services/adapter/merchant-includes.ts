import { provideIncludes } from '@spryker-oryx/core';
import { ProductResource } from '@spryker-oryx/product';
import { ApiMerchantModel } from '../../models';

export const merchantProductIncludes = provideIncludes(ProductResource, [
  ApiMerchantModel.Includes.ProductOffers,
  ApiMerchantModel.Includes.ProductOfferPrices,
  ApiMerchantModel.Includes.ProductOfferAvailabilities,
  ApiMerchantModel.Includes.Merchants,
]);

export const merchantIncludes = [...merchantProductIncludes];
