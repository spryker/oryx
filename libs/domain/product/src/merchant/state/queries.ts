import { provideQuery, Query } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { MerchantAdapter } from '../adapter';
import { Merchant, MerchantQualifier } from '../models';

export const MerchantQuery = 'oryx.merchantQuery';

export type MerchantQuery = Query<Merchant, MerchantQualifier>;

export const merchantQueries = [
  provideQuery(MerchantQuery, (adapter = inject(MerchantAdapter)) => ({
    loader: (q: MerchantQualifier) => adapter.get(q),
  })),
];
