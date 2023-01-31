import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { OrderData } from '../../../../models';
import { DeserializedOrder } from './order.model';

export const OrderNormalizer = 'oryx.OrderNormalizer*';

export function orderAttributesNormalizer(
  data: DeserializedOrder
): Partial<OrderData> {
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(value !== null && { [key]: value }),
    }),
    {}
  );
}

export const orderNormalizer: Provider[] = [
  {
    provide: OrderNormalizer,
    useValue: orderAttributesNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [OrderNormalizer]: Transformer<OrderData>[];
  }
}
