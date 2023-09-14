import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { combineLatest, Observable, of } from 'rxjs';
import { Cart } from '../../../../models';
import { CartNormalizer } from './cart.normalizer';
import { DeserializedCart } from './model';

export const CartsNormalizer = 'oryx.CartsNormalizer*';

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

export const cartsNormalizer: Provider[] = [
  {
    provide: CartsNormalizer,
    useValue: cartsItemsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CartsNormalizer]: Transformer<Cart[]>[];
  }
}
