import { Transformer } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Merchant, MerchantQualifier } from '../merchant.model';

export const MerchantAdapter = 'oryx.MerchantAdapter';
export const MerchantNormalizer = 'oryx.MerchantNormalizer*';

export interface MerchantAdapter {
  get(qualifier: MerchantQualifier): Observable<Merchant>;
}

declare global {
  interface InjectionTokensContractMap {
    [MerchantAdapter]: MerchantAdapter;
    [MerchantNormalizer]: Transformer<Merchant>;
  }
}
