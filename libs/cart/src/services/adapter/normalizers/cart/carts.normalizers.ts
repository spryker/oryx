import { Transformer, TransformerService } from '@spryker-oryx/core';
import { combineLatest, Observable } from 'rxjs';
import { Cart } from '../../../../models';
import { CartNormalizers } from './cart.normalizers';
import { DeserializedCart } from './model';

export const CartsNormalizers = 'FES.CartsNormalizers';

export function cartsNormalizer(
  data: DeserializedCart[],
  transformer: TransformerService
): Observable<Cart[] | null> {
  return combineLatest(
    data.map((cart) => transformer.transform(cart, CartNormalizers))
  );
}

export const cartsNormalizers = [cartsNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [CartsNormalizers]: Transformer<Cart[]>[];
  }
}
