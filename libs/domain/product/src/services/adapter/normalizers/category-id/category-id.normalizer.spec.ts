import { ApiProductModel } from '../../../../models';
import { categoryIdNormalizer } from './category-id.normalizer';

describe('Product Node Normalizer', () => {
  it('should transform ApiProductModel.CategoryNodes[] into DeserializedNode', () => {
    const mockTransformed = [
      { isActive: false, nodeId: 4 },
      { isActive: true, nodeId: 8 },
    ] as ApiProductModel.CategoryNodes[];
    const normalized = categoryIdNormalizer(mockTransformed);

    expect(normalized).toEqual({
      categoryId: String(mockTransformed[1].nodeId),
    });
  });
});
