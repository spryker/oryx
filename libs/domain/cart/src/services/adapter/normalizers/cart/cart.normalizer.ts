import { Transformer } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/di';
import { ApiCartModel, Cart } from '../../../../models';
import { DeserializedCart } from './model';

export const CartNormalizer = 'FES.CartNormalizer*';

export function cartAttributesNormalizer(data: DeserializedCart): Cart {
  const guestItemsKey = camelize(ApiCartModel.Includes.GuestCartItems);
  const itemsKey = camelize(ApiCartModel.Includes.Items);
  const products = data[itemsKey] ?? data[guestItemsKey];

  delete data[itemsKey];
  delete data[guestItemsKey];

  return {
    ...data,
    products,
  };
}

export const cartNormalizer: Provider[] = [
  {
    provide: CartNormalizer,
    useValue: cartAttributesNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CartNormalizer]: Transformer<Cart>[];
  }
}
