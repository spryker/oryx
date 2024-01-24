import { CamelCase } from '@spryker-oryx/core/utilities';
import { DeserializedProduct } from '@spryker-oryx/glue';
import { ApiMerchantModel } from '@spryker-oryx/merchant';

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
