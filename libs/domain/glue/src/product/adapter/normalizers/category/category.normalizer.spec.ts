import { QueryService } from '@spryker-oryx/core';
import * as di from '@spryker-oryx/di';
import { SpyInstance } from 'vitest';

import * as categoryNode from './category-node.normalizer';
import { categoryNormalizerFactory } from './category.normalizer';

const mockCategoryNode = {
  id: 'mock',
  isActive: true,
  metaDescription: 'mock',
  metaKeywords: 'mock',
  metaTitle: 'mock',
  name: 'mock',
  nodeId: 1,
  order: 1,
  parents: [],
  children: [],
};

const mockCategory = {
  id: '1',
  name: 'mockCategory',
  order: 1,
};

class MockQueryService implements Partial<QueryService> {
  emit = vi.fn();
}

vi.spyOn(categoryNode, 'categoryNodeNormalizer') as SpyInstance;
(categoryNode.categoryNodeNormalizer as unknown as SpyInstance).mockReturnValue(
  mockCategory
);

vi.spyOn(di, 'inject') as SpyInstance;

describe('categoryNormalizerFactory', () => {
  let result: object;
  let queryService: MockQueryService;

  beforeEach(() => {
    (di.inject as unknown as SpyInstance).mockReturnValue(
      (queryService = new MockQueryService())
    );
    result = categoryNormalizerFactory()([mockCategoryNode]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should inject query service', () => {
    expect(di.inject).toHaveBeenCalledWith(QueryService);
  });

  it('should map the nodes', () => {
    expect(categoryNode.categoryNodeNormalizer).toHaveBeenCalled();
  });

  it('should emit query event', () => {
    expect(queryService.emit).toHaveBeenCalledWith({
      type: CategoriesLoaded,
      data: [mockCategory],
    });
  });

  it('should return empty object', () => {
    expect(result).toEqual({});
  });

  describe('when categories data is empty', () => {
    beforeEach(() => {
      (di.inject as unknown as SpyInstance).mockReturnValue(
        (queryService = new MockQueryService())
      );
      categoryNormalizerFactory()();
    });

    it('should not emit query event', () => {
      expect(queryService.emit).not.toHaveBeenCalled();
    });
  });
});
