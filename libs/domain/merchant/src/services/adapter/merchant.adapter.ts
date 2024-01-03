import { Transformer } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import {
  Merchant,
  MerchantListQualifier,
  MerchantQualifier,
} from '../../models';

export const MerchantAdapter = 'oryx.MerchantAdapter';
export const MerchantNormalizer = 'oryx.MerchantNormalizer*';
export const MerchantListNormalizer = 'oryx.MerchantListNormalizer*';

export interface MerchantAdapter {
  get(qualifier: MerchantQualifier): Observable<Merchant>;
  getList(qualifier?: MerchantListQualifier): Observable<Merchant[]>;
}

declare global {
  interface InjectionTokensContractMap {
    [MerchantAdapter]: MerchantAdapter;
    [MerchantNormalizer]: Transformer<Merchant>;
    [MerchantListNormalizer]: Transformer<Merchant[]>;
  }
}
