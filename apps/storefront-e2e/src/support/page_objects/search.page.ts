import { AbstractSFPage } from './abstract.page';
import { TestSearchData } from '../../types/search.type';
import { SearchFragment } from '../page_fragments/search.fragment';

export class SearchPage extends AbstractSFPage {
  url = '/search';
  queryParameter: string;
  search = new SearchFragment();

  constructor(searchData?: TestSearchData) {
    super();

    if (searchData) {
      this.queryParameter = searchData.searchQuery;
      this.url += `?q=${searchData.searchQuery}`;
    }
  }

  waitForLoaded(): void {
    this.getFacets().should('be.visible');
  }

  getFacets = () => cy.get('oryx-search-facet');
  getOryxCards = () => cy.get('oryx-product-card');
  getProductSort = () => cy.get('oryx-search-product-sort');
}
