import { QueryService, Transformer } from '@spryker-oryx/core';
import { ApiProductModel, ProductCategory } from '../../../../models';
import { resolve } from '@spryker-oryx/di';
import { CategoriesLoaded } from '../../state';

export const CategoryNormalizer = 'oryx.CategoryNormalizer*';

export function categoryNormalizer(
  data: ApiProductModel.CategoryNodes[] | undefined
): object {
  const categories = data?.map<ProductCategory>(
    cat => { 
      const { nodeId, name, metaDescription, order, parents } = cat;
      const rootParent = !parents?.[0]?.parents?.length;

      return {
        id: String(nodeId),
        name,
        description: metaDescription,
        order,
        parent: !rootParent ? String(parents[0].nodeId) : undefined
      }
    }
  );

  if (categories?.length) {
    resolve(QueryService).emit({ type: CategoriesLoaded, data: categories });
  }

  return {};
}

declare global {
  interface InjectionTokensContractMap {
    [CategoryNormalizer]: Transformer<object>[];
  }
}
