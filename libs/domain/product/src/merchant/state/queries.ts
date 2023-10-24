import { provideQuery, Query } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { EMPTY } from 'rxjs';
import { MerchantAdapter } from '../adapter';
import { Merchant, MerchantQualifier } from '../merchant.model';

export const MerchantQuery = 'oryx.merchantQuery';

export type MerchantQuery = Query<Merchant, MerchantQualifier>;

export const merchantQueries = [
  provideQuery(MerchantQuery, (adapter = inject(MerchantAdapter)) => ({
    loader: (q: MerchantQualifier) =>
      q.scope === 'mininal' ? EMPTY : adapter.get(q),
    // refreshOn: [LocaleChanged],
  })),
];
