import { WithFacets } from '../mixins/page-with-facets.mixin';
import { WithProductList } from '../mixins/page-with-product-list.mixin';
import { WithProductSorting } from '../mixins/page-with-product-sorting.mixin';
import { Category } from '../types/domain.types';
import { AbstractSFPage } from './abstract.page';

export class CategoryPageBase extends AbstractSFPage {
  url = '/category/';
  categoryId: string;

  constructor(categoryData?: Category) {
    super();

    if (categoryData) {
      this.categoryId = categoryData.id;
      this.url += categoryData.id;
      if (categoryData.search) {
        this.url += `?${categoryData.search}`;
      }
    }
  }

  waitForLoaded(): void {
    //
  }
}

export const CategoryPage = WithProductSorting(
  WithProductList(WithFacets(CategoryPageBase))
);
