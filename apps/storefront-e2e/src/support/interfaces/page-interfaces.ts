import { FacetsFragment } from '../page-fragments/facets.fragment';
import { ProductSortingFragment } from '../page-fragments/products-sorting.fragment';

export interface IPageWithFacets {
  getFacets(): FacetsFragment;
}

export interface IPageWithProductSorting {
  getProductSorting(): ProductSortingFragment;
}

export interface IPageWithProductList {
  getProductCards(): Cypress.Chainable<JQuery<HTMLElement>>;
  getProductHeadings(): Cypress.Chainable<JQuery<HTMLElement>>;
}
