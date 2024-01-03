import { TransformerService } from '@spryker-oryx/core';
import { Observable, combineLatest, of } from 'rxjs';
import { ApiMerchantModel, Merchant } from '../../../models';
import { MerchantNormalizer } from '../merchant.adapter';

export function merchantListNormalizer(
  data: ApiMerchantModel.Merchant[],
  transformer: TransformerService
): Observable<Merchant[]> {
  return data.length
    ? combineLatest(
        data.map((cart) => transformer.transform(cart, MerchantNormalizer))
      )
    : of([]);
}
