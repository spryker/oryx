import { ProductAvailability } from '@spryker-oryx/product';
import { DeserializedAvailability } from './model';

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
