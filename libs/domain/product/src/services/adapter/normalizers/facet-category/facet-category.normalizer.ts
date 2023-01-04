import { Transformer } from '@spryker-oryx/core';
import { ApiProductListModel, Facet, FacetValue } from '../../../../models';
import { parseFacetValue } from '../facet';

export interface FacetCategory {
  categoryFacet: ApiProductListModel.ValueFacet;
  categoryTreeFilter: ApiProductListModel.TreeFacet[];
}

export const FacetCategoryNormalizer = 'FES.FacetCategoryNormalizer*';

export function facetCategoryNormalizer(fasets: FacetCategory): Facet {
  const { categoryFacet, categoryTreeFilter } = fasets;
  const parsedCategoryFacet = parseFacetValue(categoryFacet);

  let valuesTreeLength = 0;

  const parse = (
    categoryTree: ApiProductListModel.TreeFacet[],
    valuesList: FacetValue[]
  ): FacetValue[] =>
    categoryTree.reduce((treeList: FacetValue[], treeItem) => {
      if (!treeItem.docCount) {
        return treeList;
      }

      valuesTreeLength += 1;

      const parsedTree = {
        ...valuesList.find((valueList) => valueList.value === treeItem.nodeId)!,
        name: treeItem.name,
        children: treeItem.children?.length
          ? parse(treeItem.children, valuesList)
          : [],
      };

      return [...treeList, parsedTree];
    }, []);

  const categoryTree = {
    values: parse(
      categoryTreeFilter,
      parsedCategoryFacet!.values as FacetValue[]
    ),
    valuesTreeLength,
  };

  return {
    ...parsedCategoryFacet!,
    ...categoryTree,
  };
}

declare global {
  interface InjectionTokensContractMap {
    [FacetCategoryNormalizer]: Transformer<Facet>[];
  }
}
