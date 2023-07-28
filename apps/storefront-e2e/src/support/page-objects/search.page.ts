import { AbstractSFPage } from './abstract.page';
import { SearchParameters } from '../types/search.type';
import { SearchFragment } from '../page-fragments/search.fragment';

export class SearchPage extends AbstractSFPage {
  url = '/search';
  queryParameter: string;
  search = new SearchFragment();

  constructor(searchData?: SearchParameters) {
    super();

    if (searchData) {
      this.queryParameter = searchData.q;
      this.url += `?q=${searchData.q}`;
    }
  }

  waitForLoaded(): void {
    this.getFacets().should('be.visible');
  }

  getFacets = () => cy.get('oryx-search-facet');
  getOryxCards = () => cy.get('oryx-product-card');
  getProductSort = () => cy.get('oryx-search-product-sort');
}
