import { Transformer } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Merchant, MerchantQualifier, ProductOffer } from '../../models';

export const MerchantAdapter = 'oryx.MerchantAdapter';
export const MerchantNormalizer = 'oryx.MerchantNormalizer*';

export const OfferNormalizer = 'oryx.OfferNormalizer*';

export interface MerchantAdapter {
  get(qualifier: MerchantQualifier): Observable<Merchant>;
}

declare global {
  interface InjectionTokensContractMap {
    [MerchantAdapter]: MerchantAdapter;
    [MerchantNormalizer]: Transformer<Merchant>;
    [OfferNormalizer]: Transformer<ProductOffer>;
  }
}
