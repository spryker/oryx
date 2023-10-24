import {
  checkProductCardsFilteringByName,
  checkProductCardsFilteringByPrice,
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
      checkProductCardsFilteringByName(searchPage, 4, 3, query);

      // apply 2nd filter
      searchPage.getFacets().setColor('Black');
      searchPage.waitForSearchRequest();
      checkProductCardsFilteringByName(searchPage, 3, 1, query);

      // clear 2nd filter
      // we don't expect search request here because previous query is cached
      searchPage.getFacets().resetColor();
      checkProductCardsFilteringByName(searchPage, 4, 3, query);
    });

    it('should apply price filterring', () => {
      // set brand to limit a number of products displayed
      // and avoid issues with concrete products displaying
      searchPage = new SearchPage({ q: 'Cameras' });
      searchPage.visit();
      searchPage.getFacets().setBrand('Kodak');

      const minPrice = 200;
      const maxPrice = 400;

      cy.log('set minimum price');
      searchPage.getFacets().setMinPrice(minPrice);
      searchPage.waitForSearchRequest();
      checkProductCardsFilteringByPrice(searchPage, minPrice);

      cy.log('reset prices, set max price');
      searchPage.getFacets().resetPrices();
      searchPage.waitForSearchRequest();
      searchPage.getFacets().setMaxPrice(maxPrice);
      searchPage.waitForSearchRequest();
      checkProductCardsFilteringByPrice(searchPage, 0, maxPrice);

      cy.log('reset prices, change min price range');
      searchPage.getFacets().resetPrices();
      searchPage.waitForSearchRequest();
      searchPage.getFacets().setMinPriceRange(minPrice);
      searchPage.waitForSearchRequest();
      checkProductCardsFilteringByPrice(searchPage, minPrice);

      cy.log('reset prices, change max price range');
      searchPage.getFacets().resetPrices();
      searchPage.waitForSearchRequest();
      searchPage.getFacets().setMaxPriceRange(maxPrice);
      searchPage.waitForSearchRequest();
      checkProductCardsFilteringByPrice(searchPage, 0, maxPrice);
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
      checkProductCardsSortingBySku(searchPage, sortingTestData.default);
    });

    it('should apply all sorting options', () => {
      Object.keys(sortingTestData)
        .filter((option) => option !== 'default')
        .forEach((option) => {
          cy.log(`Sorting: ${option} is applied`);
          searchPage.getProductSorting().applySorting(option);
          searchPage.waitForSearchRequest();

          checkProductCardsSortingBySku(searchPage, sortingTestData[option]);
        });
    });
  });
});
