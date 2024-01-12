import { CamelCase } from '@spryker-oryx/core/utilities';
import { ApiMerchantModel } from '@spryker-oryx/merchant';
import { DeserializedProduct } from '@spryker-oryx/product';

export type DeserializedMerchantProductIncludes = {
  [P in ApiMerchantModel.Includes as `${CamelCase<P>}`]?: P extends ApiMerchantModel.Includes.ProductOffers
    ? ApiMerchantModel.ProductOffer[]
    : never;
};

export type DeserializedMerchantProduct = DeserializedProduct &
  Pick<
    DeserializedMerchantProductIncludes,
    CamelCase<ApiMerchantModel.Includes.ProductOffers>
  >;
