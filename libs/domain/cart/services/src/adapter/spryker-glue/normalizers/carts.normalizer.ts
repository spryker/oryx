import { Cart, CartNormalizer } from '@spryker-oryx/cart';
import { TransformerService } from '@spryker-oryx/core';
import { Observable, combineLatest, of } from 'rxjs';
import { DeserializedCart } from './model';

export function cartsItemsNormalizer(
  data: DeserializedCart[],
  transformer: TransformerService
): Observable<Cart[]> {
  return data.length
    ? combineLatest(
        data.map((cart) => transformer.transform(cart, CartNormalizer))
      )
    : of([]);
}
