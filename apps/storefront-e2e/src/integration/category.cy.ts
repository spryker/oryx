import {
  checkProductCardsFilteringByName,
  checkProductCardsSortingBySku,
} from '../support/checks';
import { CategoryPage } from '../support/page-objects/category.page';
import { sortingTestData } from '../support/test-data/search-products';

describe('Category suite', () => {
  describe('Products filtering', () => {
    let categoryPage;
    const query = 'DELL Inspiron 7359';

    beforeEach(() => {
      categoryPage = new CategoryPage({ id: '6' });
      categoryPage.visit();
    });

    it('should update products and facets when filters are applied/cleared', () => {
      // apply 1st filter
      categoryPage.getFacets().setColor('Silver');
      categoryPage.waitForSearchRequest();
      checkProductCardsFilteringByName(categoryPage, 3, 2, query);

      // apply 2nd filter
      categoryPage.getFacets().setBrand('DELL');
      categoryPage.waitForSearchRequest();
      checkProductCardsFilteringByName(categoryPage, 3, 1, query);

      // clear 2nd filter
      // we don't expect search request here because previous query is cached
      categoryPage.getFacets().resetBrand();
      checkProductCardsFilteringByName(categoryPage, 3, 2, query);
    });

    it('should apply price filtering', () => {
      const minPrice = 100;
      const maxPrice = 400;
      const minPriceRange = 110;
      const maxPriceRange = 390;

      const expectedParamsMin = { 'price[min]': `${minPrice}` };
      const expectedParamsMinAndMax = {
        'price[min]': `${minPrice}`,
        'price[max]': `${maxPrice}`,
      };

      //min and max price search params are not specified in the url
      categoryPage.checkUrlParams({
        'price[min]': null,
        'price[max]': null,
      });

      // set min price by input
      categoryPage.getFacets().setMinPrice(minPrice);
      categoryPage.waitForSearchRequest(expectedParamsMin);
      categoryPage.checkUrlParams(expectedParamsMin);

      //set max price by input
      categoryPage.getFacets().setMaxPrice(maxPrice);
      categoryPage.waitForSearchRequest(expectedParamsMinAndMax);
      categoryPage.checkUrlParams(expectedParamsMinAndMax);

      // reset prices
      categoryPage.getFacets().resetPrices();
      categoryPage.checkUrlParams({
        'price[min]': null,
        'price[max]': null,
      });

      const expectedParamsMinRange = { 'price[min]': `${minPriceRange}` };
      const expectedParamsMinAndMaxRange = {
        'price[min]': `${minPriceRange}`,
        'price[max]': `${maxPriceRange}`,
      };

      //set min price on the range slider
      categoryPage.getFacets().setMinPriceRange(minPriceRange);
      categoryPage.waitForSearchRequest(expectedParamsMinRange);
      categoryPage.checkUrlParams(expectedParamsMinRange);

      //set max price on the range slider
      categoryPage.getFacets().setMaxPriceRange(maxPriceRange);
      categoryPage.waitForSearchRequest(expectedParamsMinAndMaxRange);
      categoryPage.checkUrlParams(expectedParamsMinAndMaxRange);

      // TODO: when all these checks are done -> move these to searcy.cy.ts
      // price filtering should also work on Search page
    });
  });

  describe('Products sorting', () => {
    let categoryPage;

    beforeEach(() => {
      categoryPage = new CategoryPage({ id: '15' });
      categoryPage.visit();
    });

    it('should apply default sorting when sorting is cleared', () => {
      // check default sorting
      checkProductCardsSortingBySku(categoryPage, sortingTestData.default);

      // change sorting
      categoryPage
        .getProductSorting()
        .applySorting(Object.keys(sortingTestData)[2]);
      categoryPage.waitForSearchRequest();

      // clear sorting and check that it is default again
      categoryPage.getProductSorting().clearSorting();
      checkProductCardsSortingBySku(categoryPage, sortingTestData.default);
    });

    it('should apply all sorting options', () => {
      Object.keys(sortingTestData).forEach((option) => {
        // default options does not exist in the dropdown
        // we should skip it
        if (option === 'default') {
          return;
        }

        cy.log(`Sorting: ${option} is applied`);
        categoryPage.getProductSorting().applySorting(option);
        categoryPage.waitForSearchRequest();

        checkProductCardsSortingBySku(categoryPage, sortingTestData[option]);
      });
    });
  });
});
