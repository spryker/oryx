import {
  IPageWithFacets,
  IPageWithProductList,
  IPageWithProductSorting,
} from '../interfaces/page-interfaces';
import { FacetsFragment } from '../page-fragments/facets.fragment';
import { ProductSortingFragment } from '../page-fragments/products-sorting.fragment';
import { Category } from '../types/category.type';
import { AbstractSFPage } from './abstract.page';

export class CategoryPage
  extends AbstractSFPage
  implements IPageWithProductList, IPageWithFacets, IPageWithProductSorting
{
  url = '/category/';
  categoryId: string;

  constructor(categoryData?: Category) {
    super();

    if (categoryData) {
      this.categoryId = categoryData.id;
      this.url += categoryData.id;
    }

    this.initSearchInterceptor();
  }

  initSearchInterceptor(): void {
    cy.intercept('/catalog-search?**').as('catalogSearch');
  }

  waitForSearchRequest(): void {
    cy.wait('@catalogSearch');
    // wait till product cards are re-renreded after search
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  }

  waitForLoaded(): void {
    this.waitForSearchRequest();
  }

  getProductSorting = () => new ProductSortingFragment();
  getFacets = () => new FacetsFragment();
  getProductCards = () => cy.get('oryx-product-card');
  getProductHeadings = () => this.getProductCards().find('oryx-heading');
}
