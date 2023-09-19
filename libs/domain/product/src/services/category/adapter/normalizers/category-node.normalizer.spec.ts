import { categoryNodeNormalizer } from './category-node.normalizer';

const rootParent = {
  isActive: true,
  metaDescription: 'root',
  metaKeywords: 'root',
  metaTitle: 'root',
  name: 'root',
  nodeId: 0,
  order: 0,
  children: [],
};

const mockParent = {
  isActive: true,
  metaDescription: 'parent',
  metaKeywords: 'parent',
  metaTitle: 'parent',
  name: 'parent',
  nodeId: 1,
  order: 1,
  children: [],
  parents: [rootParent],
};

const noDescription = {
  isActive: true,
  metaKeywords: 'parent',
  metaTitle: 'parent',
  name: 'name',
  nodeId: 1,
  order: 1,
  children: [],
};

const mockCategory = {
  isActive: true,
  metaDescription: 'mock',
  metaKeywords: 'mock',
  metaTitle: 'mock',
  name: 'mock',
  nodeId: 2,
  order: 2,
  parents: [mockParent],
  children: [],
};

const mappedCategory = {
  id: '2',
  name: 'mock',
  description: 'mock',
  order: 2,
  parent: '1',
};

const mappedParent = {
  id: '1',
  name: 'parent',
  description: 'parent',
  order: 1,
};

const mappedNoDescription = {
  id: '1',
  name: 'name',
  description: 'name',
  order: 1,
};

describe('categoryNodeNormalizer', () => {
  it('should map the category', () => {
    expect(categoryNodeNormalizer(mockCategory)).toEqual(mappedCategory);
  });

  describe('when category does not contain metaDescription', () => {
    it('should map name as description', () => {
      expect(categoryNodeNormalizer(noDescription)).toEqual(
        mappedNoDescription
      );
    });
  });

  describe('when parent is root', () => {
    it('should not store parent`s id', () => {
      expect(categoryNodeNormalizer(mockParent)).toEqual(mappedParent);
    });
  });
});
