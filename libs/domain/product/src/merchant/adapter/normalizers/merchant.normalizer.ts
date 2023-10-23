import { ApiProductModel } from '@spryker-oryx/product';
import { Merchant } from '../../models';

export function merchantNormalizer(data: ApiProductModel.Merchant): Merchant {
  return {
    id: data.id,
    name: data.merchantName,
    url: data.merchantUrl,
    deliveryTime: data.deliveryTime,
  } as Merchant;
}
