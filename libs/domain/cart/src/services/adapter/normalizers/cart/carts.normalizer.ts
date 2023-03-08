import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { combineLatest, Observable } from 'rxjs';
import { Cart } from '../../../../models';
import { CartNormalizer } from './cart.normalizer';
import { DeserializedCart } from './model';

export const CartsNormalizer = 'oryx.CartsNormalizer*';

export function cartsItemsNormalizer(
  data: DeserializedCart[],
  transformer: TransformerService
): Observable<Cart[] | null> {
  return combineLatest(
    data.map((cart) => transformer.transform(cart, CartNormalizer))
  );
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
