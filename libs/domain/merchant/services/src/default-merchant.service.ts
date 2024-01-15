import { injectQuery, QueryState } from '@spryker-oryx/core';
import {
  Merchant,
  MerchantQualifier,
  MerchantQuery,
  MerchantService,
} from '@spryker-oryx/merchant';
import { Observable } from 'rxjs';

export class DefaultMerchantService implements MerchantService {
  protected merchantQuery = injectQuery<Merchant, MerchantQualifier>(
    MerchantQuery
  );

  get(qualifier: MerchantQualifier): Observable<Merchant | undefined> {
    return this.merchantQuery.get(qualifier);
  }

  getState(qualifier: MerchantQualifier): Observable<QueryState<Merchant>> {
    return this.merchantQuery.getState(qualifier);
  }
}
