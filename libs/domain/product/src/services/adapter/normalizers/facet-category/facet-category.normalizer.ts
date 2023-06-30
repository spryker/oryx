import { Transformer } from '@spryker-oryx/core';
import { ApiProductListModel, Facet, FacetValue } from '../../../../models';
import { parseFacetValue } from '../facet';

export interface FacetCategory {
  categoryFacet: ApiProductListModel.ValueFacet;
  categoryTreeFilter: ApiProductListModel.TreeFacet[];
}

export const FacetCategoryNormalizer = 'oryx.FacetCategoryNormalizer*';

export function facetCategoryNormalizer(fasets: FacetCategory): Facet {
  const { categoryFacet, categoryTreeFilter } = fasets;
  const parsedCategoryFacet = parseFacetValue(categoryFacet);

  const parse = (
    categoryTree: ApiProductListModel.TreeFacet[],
    valuesList: FacetValue[]
  ): any =>
    categoryTree
      .filter(({ docCount }) => !!docCount)
      .map((treeItem) => ({
        ...valuesList.find((valueList) => valueList.value === treeItem.nodeId)!,
        name: treeItem.name,
        children: treeItem.children?.length
          ? parse(treeItem.children, valuesList)
          : [],
      }));

  const categoryTreeValues = parse(
    categoryTreeFilter,
    (parsedCategoryFacet?.values as FacetValue[]) ?? []
  );

  const categoryTree = {
    values: categoryTreeValues,
    valuesTreeLength: categoryTreeValues.length,
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
