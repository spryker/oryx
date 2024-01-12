import { provideQuery, Query } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { Merchant, MerchantQualifier } from '../../models';
import { MerchantAdapter } from '../adapter';

export const MerchantQuery = 'oryx.merchantQuery';

export type MerchantQuery = Query<Merchant, MerchantQualifier>;

export const merchantQueries = [
  provideQuery(MerchantQuery, (adapter = inject(MerchantAdapter)) => ({
    loader: (q: MerchantQualifier) => adapter.get(q),
    refreshOn: [LocaleChanged],
  })),
];
