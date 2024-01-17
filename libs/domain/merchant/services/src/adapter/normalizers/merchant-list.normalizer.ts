import { TransformerService } from '@spryker-oryx/core';
import {
  ApiMerchantModel,
  Merchant,
  MerchantNormalizer,
} from '@spryker-oryx/merchant';
import { Observable, combineLatest, of } from 'rxjs';

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
