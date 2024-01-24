import { ApiProductModel } from '../../../models/product.api.model';
import { categoryIdNormalizer } from './category-id.normalizer';

describe('Product Node Normalizer', () => {
  it('should transform ApiProductModel.CategoryNodes[] into DeserializeCategoryIds', () => {
    const mockTransformed = [
      { isActive: false, nodeId: 4 },
      { isActive: true, nodeId: 2 },
      { isActive: true, nodeId: 8 },
    ] as ApiProductModel.CategoryNodes[];
    const normalized = categoryIdNormalizer(mockTransformed);

    expect(normalized).toEqual({
      categoryIds: [
        String(mockTransformed[1].nodeId),
        String(mockTransformed[2].nodeId),
      ],
    });
  });
});
