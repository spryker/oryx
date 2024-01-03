import { provideQuery, Query } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import {
  Merchant,
  MerchantListQualifier,
  MerchantQualifier,
} from '../../models';
import { MerchantAdapter } from '../adapter';

export const MerchantQuery = 'oryx.merchantQuery';
export const MerchantListQuery = 'oryx.merchantListQuery';

export type MerchantQuery = Query<Merchant, MerchantQualifier>;
export type MerchantListQuery = Query<Merchant[], MerchantListQuery>;

export const merchantQueries = [
  provideQuery(MerchantQuery, (adapter = inject(MerchantAdapter)) => ({
    loader: (q: MerchantQualifier) => adapter.get(q),
    // q.scope === 'mininal' ? EMPTY : adapter.get(q),
    refreshOn: [LocaleChanged],
  })),

  provideQuery(MerchantListQuery, (adapter = inject(MerchantAdapter)) => ({
    loader: (q: MerchantListQualifier) => adapter.getList(q),
    refreshOn: [LocaleChanged],
  })),
];
