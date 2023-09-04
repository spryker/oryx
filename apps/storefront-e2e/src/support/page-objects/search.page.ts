import {
  IPageWithFacets,
  IPageWithProductList,
  IPageWithProductSorting,
} from '../interfaces/page-interfaces';
import { FacetsFragment } from '../page-fragments/facets.fragment';
import { ProductSortingFragment as ProductsSortingFragment } from '../page-fragments/products-sorting.fragment';
import { SearchBoxFragment } from '../page-fragments/search-box.fragment';
import { SearchParameters } from '../types/search.type';
import { AbstractSFPage } from './abstract.page';

export class SearchPage
  extends AbstractSFPage
  implements IPageWithProductList, IPageWithFacets, IPageWithProductSorting
{
  url = '/search';
  queryParameter: string;
  searchbox = new SearchBoxFragment();

  constructor(searchData?: SearchParameters) {
    super();

    if (searchData) {
      this.queryParameter = searchData.q;
      this.url += `?q=${searchData.q}`;
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
    cy.wait(250);
  }

  waitForLoaded(): void {
    this.waitForSearchRequest();
  }

  getProductSorting = () => new ProductsSortingFragment();
  getFacets = () => new FacetsFragment();
  getProductCards = () => cy.get('oryx-product-card');
  getProductHeadings = () => this.getProductCards().find('oryx-heading');
}
