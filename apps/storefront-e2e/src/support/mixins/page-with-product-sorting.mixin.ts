import { ProductSortingFragment } from '../page-fragments/products-sorting.fragment';
import { E2EPage } from '../page-objects/abstract.page';
import { Constructor } from '../types/utils.types';

export interface IPageWithProductSorting {
  getProductSorting(): ProductSortingFragment;
}

export function WithProductSorting<TPage extends Constructor<E2EPage>>(
  Page: TPage
) {
  return class PageWithProductSorting
    extends Page
    implements IPageWithProductSorting
  {
    constructor(...args: any[]) {
      super(...args);
    }

    getProductSorting = () => new ProductSortingFragment();
  };
}
