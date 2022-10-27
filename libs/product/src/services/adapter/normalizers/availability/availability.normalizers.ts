import { Transformer } from '@spryker-oryx/core';
import { ProductAvailability } from '../../../../models/product.model';
import { DeserializedAvailability } from './model';

export const AvailabilityNormalizers = 'FES.AvailabilityNormalizers';

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

export const availabilityNormalizers = [availabilityNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [AvailabilityNormalizers]: Transformer<ProductAvailability>[];
  }
}
