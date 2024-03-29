/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { availabilityNormalizer } from './availability.normalizer';
import { DeserializedAvailability } from './model';

const mockAvailability: DeserializedAvailability = {
  id: 'test',
  isNeverOutOfStock: false,
  availability: false,
  quantity: '10',
} as DeserializedAvailability;

describe('Product Availability Normalizer', () => {
  it('should transform ApiProductModel.ProductAvailability into ProductAvailability', () => {
    const mockTransformed = {
      isNeverOutOfStock: false,
      availability: false,
      quantity: Number(mockAvailability.quantity),
    };
    const normalized = availabilityNormalizer(mockAvailability);

    expect(normalized).toEqual(mockTransformed);
  });
});
