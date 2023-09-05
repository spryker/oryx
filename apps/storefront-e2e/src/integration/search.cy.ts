import {
  checkProductCardsFilterring,
  checkProductCardsSortingBySku,
} from '../support/checks';
import { SearchPage } from '../support/page-objects/search.page';
import { sortingTestData } from '../support/test-data/search-products';

let searchPage;

describe('Search suite', () => {
  describe('Products filtering', () => {
    const query = 'TomTom';

    beforeEach(() => {
      searchPage = new SearchPage({ q: query });
      searchPage.visit();
    });

    it('should update products and facets when filters are applied/cleared', () => {
      // apply 1st filter
      searchPage.getFacets().setTouchscreen('Yes');
      searchPage.waitForSearchRequest();
      checkProductCardsFilterring(searchPage, 4, 3, query);

      // apply 2nd filter
      searchPage.getFacets().setColor('Black');
      searchPage.waitForSearchRequest();
      checkProductCardsFilterring(searchPage, 3, 1, query);

      // clear 2nd filter
      // we don't expect search request here because previous query is cached
      searchPage.getFacets().resetColor();
      checkProductCardsFilterring(searchPage, 4, 3, query);
    });
  });

  describe('Products sorting', () => {
    beforeEach(() => {
      searchPage = new SearchPage({ q: 'Cable' });
      cy.visit(searchPage.url);
    });

    it('should apply default sorting when sorting is cleared', () => {
      // check default sorting
      checkProductCardsSortingBySku(searchPage, sortingTestData.default);

      // change sorting
      searchPage
        .getProductSorting()
        .applySorting(Object.keys(sortingTestData)[2]);
      searchPage.waitForSearchRequest();

      // clear sorting and check that it is default again
      searchPage.getProductSorting().clearSorting();
      searchPage.waitForSearchRequest();
      checkProductCardsSortingBySku(searchPage, sortingTestData.default);
    });

    it('should apply all sorting options', () => {
      Object.keys(sortingTestData).forEach((option) => {
        // default options does not exist in the dropdown
        // we should skip it
        if (option === 'default') {
          return;
        }

        cy.log(`Sorting: ${option} is applied`);
        searchPage.getProductSorting().applySorting(option);
        searchPage.waitForSearchRequest();

        checkProductCardsSortingBySku(searchPage, sortingTestData[option]);
      });
    });
  });
});
