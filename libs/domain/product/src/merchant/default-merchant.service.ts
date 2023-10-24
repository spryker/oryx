import { injectQuery, QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Merchant, MerchantQualifier } from './merchant.model';
import { MerchantService } from './merchant.service';
import { MerchantQuery } from './state';

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
