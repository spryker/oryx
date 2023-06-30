import { Transformer } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/di';
import { ApiCartModel, Cart } from '../../../../models';
import { DeserializedCart } from './model';

export const CartNormalizer = 'oryx.CartNormalizer*';

export function cartAttributesNormalizer(data: DeserializedCart): Cart {
  const guestItemsKey = camelize(ApiCartModel.Includes.GuestCartItems);
  const itemsKey = camelize(ApiCartModel.Includes.Items);
  const products = data[itemsKey] ?? data[guestItemsKey];

  delete data[itemsKey];
  delete data[guestItemsKey];

  // we don't want to have shipment and expense totals in the default cart response
  // as we can't recognize if shipment is calculated or not in case if it's zero
  if (data.totals?.shipmentTotal === 0) {
    delete data.totals?.shipmentTotal;
    delete data.totals?.expenseTotal;
  }

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
