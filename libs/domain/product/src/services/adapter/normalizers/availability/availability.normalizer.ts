import { Transformer } from '@spryker-oryx/core';
import { ProductAvailability } from '../../../../models/product.model';
import { DeserializedAvailability } from './model';

export const AvailabilityNormalizer = 'oryx.AvailabilityNormalizer*';

export function availabilityNormalizer(
  data: DeserializedAvailability | undefined
): ProductAvailability | undefined {
  if (!data) {
    return;
  }

  const { id, ...availability } = data;
  return {
    ...availability,
    quantity: Number(availability.quantity),
  };
}

declare global {
  interface InjectionTokensContractMap {
    [AvailabilityNormalizer]: Transformer<ProductAvailability>[];
  }
}
