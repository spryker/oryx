import { QueryService } from '@spryker-oryx/core';
import * as di from '@spryker-oryx/di';
import { SpyInstance } from 'vitest';
import { CategoriesLoaded } from '../../state';
import { categoryListNormalizerFactory } from './category-list.normalizer';
import * as categoryTree from './category-tree.normalizer';

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

const nodes = [mockCategoryNode];
const categories = [mockCategory];

class MockQueryService implements Partial<QueryService> {
  emit = vi.fn();
}

vi.spyOn(categoryTree, 'flattenCategoryNodes') as SpyInstance;
(categoryTree.flattenCategoryNodes as unknown as SpyInstance).mockReturnValue(
  categories
);

vi.spyOn(di, 'inject') as SpyInstance;

describe('categoryListNormalizerFactory', () => {
  let result: object;
  let queryService: MockQueryService;

  beforeEach(() => {
    (di.inject as unknown as SpyInstance).mockReturnValue(
      (queryService = new MockQueryService())
    );
    result = categoryListNormalizerFactory()(nodes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should inject query service', () => {
    expect(di.inject).toHaveBeenCalledWith(QueryService);
  });

  it('should flatten the nodes', () => {
    expect(categoryTree.flattenCategoryNodes).toHaveBeenCalledWith(nodes);
  });

  it('should emit query event', () => {
    expect(queryService.emit).toHaveBeenCalledWith({
      type: CategoriesLoaded,
      data: categories,
    });
  });

  it('should return empty object', () => {
    expect(result).toEqual({});
  });

  describe('when categories data is empty', () => {
    beforeEach(() => {
      (
        categoryTree.flattenCategoryNodes as unknown as SpyInstance
      ).mockReturnValue([]);
      categoryListNormalizerFactory()();
    });

    it('should flatten empty array', () => {
      expect(categoryTree.flattenCategoryNodes).toHaveBeenCalledWith([]);
    });

    it('should not emit query event', () => {
      expect(queryService.emit).not.toHaveBeenCalled();
    });
  });
});
