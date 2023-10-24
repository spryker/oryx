import { QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Merchant, MerchantQualifier } from './merchant.model';

export interface MerchantService {
  get(qualifier: MerchantQualifier): Observable<Merchant | undefined>;
  getState(qualifier: MerchantQualifier): Observable<QueryState<Merchant>>;
}

export const MerchantService = 'oryx.MerchantService';

declare global {
  interface InjectionTokensContractMap {
    [MerchantService]: MerchantService;
  }
}
