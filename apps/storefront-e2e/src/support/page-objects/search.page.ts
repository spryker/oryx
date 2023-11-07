import { WithFacets } from '../mixins/page-with-facets.mixin';
import { WithProductList } from '../mixins/page-with-product-list.mixin';
import { WithProductSorting } from '../mixins/page-with-product-sorting.mixin';
import { SearchParameters } from '../types/domain.types';
import { AbstractSFPage } from './abstract.page';

export class SearchPageBase extends AbstractSFPage {
  url = '/search';
  queryParameter: string;

  constructor(searchData?: SearchParameters) {
    super();

    if (searchData) {
      this.queryParameter = searchData.q;
      this.url += `?q=${searchData.q}`;
      if (searchData.search) {
        this.url += `&${searchData.search}`;
      }
    }
  }

  waitForLoaded(): void {
    //
  }
}

export const SearchPage = WithProductSorting(
  WithProductList(WithFacets(SearchPageBase))
);
