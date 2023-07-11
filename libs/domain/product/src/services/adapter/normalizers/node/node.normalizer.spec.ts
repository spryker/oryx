import { ApiProductModel } from '../../../../models';
import { nodeNormalizer } from './node.normalizer';

describe('Product Node Normalizer', () => {
  it('should transform ApiProductModel.CategoryNodes[] into DeserializedNode', () => {
    const mockTransformed = [
      { isActive: false, nodeId: 4 },
      { isActive: true, nodeId: 8 },
    ] as ApiProductModel.CategoryNodes[];
    const normalized = nodeNormalizer(mockTransformed);

    expect(normalized).toEqual({
      nodeId: String(mockTransformed[1].nodeId),
    });
  });
});
