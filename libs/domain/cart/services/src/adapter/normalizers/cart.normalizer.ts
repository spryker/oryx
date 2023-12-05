import { ApiCartModel, Cart } from '@spryker-oryx/cart';
import { camelize } from '@spryker-oryx/core/utilities';
import { DeserializedCart } from './model';

export function cartAttributesNormalizer(data: DeserializedCart): Cart {
  const guestItemsKey = camelize(ApiCartModel.Includes.GuestCartItems);
  const itemsKey = camelize(ApiCartModel.Includes.Items);
  const products = data[itemsKey] ?? data[guestItemsKey];
  const coupons = data[camelize(ApiCartModel.Includes.Coupons)];

  delete data[itemsKey];
  delete data[guestItemsKey];

  // Workaround for shipmentTotals = 0
  // we don't want to have shipment and expense totals in the default cart response
  // as we can't recognize if shipment is calculated or not in case if it's zero
  if (!data.totals?.shipmentTotal) {
    delete data.totals?.shipmentTotal;
  }

  return {
    ...data,
    products,
    coupons,
  };
}
