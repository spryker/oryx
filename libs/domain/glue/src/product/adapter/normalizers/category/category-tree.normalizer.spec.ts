import { ProductCategory } from '@spryker-oryx/product';
import { categoryTreeNormalizer } from './category-tree.normalizer';

const mockChild = {
  isActive: true,
  metaDescription: 'mock',
  metaKeywords: 'mock',
  metaTitle: 'mock',
  name: 'mock',
  nodeId: 2,
  order: 2,
  children: [],
};

const mockParent = {
  id: 'parent',
  isActive: true,
  metaDescription: 'parent',
  metaKeywords: 'parent',
  metaTitle: 'parent',
  name: 'parent',
  nodeId: 1,
  order: 1,
  children: [mockChild],
};

const mappedParent = {
  id: '1',
  name: 'parent',
  description: 'parent',
  order: 1,
};

const mappedChild = {
  id: '2',
  name: 'mock',
  description: 'mock',
  order: 2,
  parent: '1',
};

const nodes = [mockParent];
const tree = [{ categoryNodesStorage: nodes }];

describe('categoryTreeNormalizer', () => {
  let result: ProductCategory[] = [];

  beforeEach(() => {
    result = categoryTreeNormalizer(tree);
  });

  it('should flatten the tree', () => {
    expect(result).toEqual(expect.arrayContaining([mappedParent, mappedChild]));
  });

  describe('when tree is empty', () => {
    beforeEach(() => {
      result = categoryTreeNormalizer([]);
    });

    it('should flatten the tree', () => {
      expect(result).toEqual([]);
    });
  });
});
