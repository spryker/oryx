import { Transformer } from '@spryker-oryx/core';
import {
  Merchant,
  MerchantListQualifier,
  MerchantQualifier,
  ProductOffer,
} from '@spryker-oryx/merchant';
import { Observable } from 'rxjs';

export const MerchantAdapter = 'oryx.MerchantAdapter';
export const MerchantNormalizer = 'oryx.MerchantNormalizer*';
export const MerchantListNormalizer = 'oryx.MerchantListNormalizer*';

export const OfferNormalizer = 'oryx.OfferNormalizer*';

export interface MerchantAdapter {
  get(qualifier: MerchantQualifier): Observable<Merchant>;
  getList(qualifier?: MerchantListQualifier): Observable<Merchant[]>;
}

declare global {
  interface InjectionTokensContractMap {
    [MerchantAdapter]: MerchantAdapter;
    [MerchantNormalizer]: Transformer<Merchant>;
    [MerchantListNormalizer]: Transformer<Merchant[]>;
    [OfferNormalizer]: Transformer<ProductOffer>;
  }
}
