import {
  checkProductCardsFilterringByName,
  checkProductCardsFilterringByPrice,
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
      checkProductCardsFilterringByName(categoryPage, 3, 2, query);

      // apply 2nd filter
      categoryPage.getFacets().setBrand('DELL');
      categoryPage.waitForSearchRequest();
      checkProductCardsFilterringByName(categoryPage, 3, 1, query);

      // clear 2nd filter
      // we don't expect search request here because previous query is cached
      categoryPage.getFacets().resetBrand();
      checkProductCardsFilterringByName(categoryPage, 3, 2, query);
    });

    it('should apply price filterring', () => {
      const minPrice = 100;
      const maxPrice = 700;

      // set min price
      // TODO: min price change does not trigger product list update
      // categoryPage.getFacets().setMinPrice(minPrice);
      // categoryPage.waitForSearchRequest();
      // checkProductCardsPriceFilterringByPrice(categoryPage, minPrice);

      // reset prices, set max price
      // TODO: reset prices button never appears. If it is not implemented -> refresh the page
      // and remove resetPrices method
      // TODO: max price change does not trigger product list update
      // categoryPage.getFacets().resetPrices();
      // categoryPage.waitForSearchRequest();
      // categoryPage.getFacets().setMaxPrice(maxPrice);
      // categoryPage.waitForSearchRequest();
      // checkProductCardsPriceFilterringByPrice(categoryPage, 0, maxPrice);

      // reset prices, change min price range
      // TODO: reset prices button never appears. If it is not implemented -> refresh the page
      // and remove resetPrices method
      // categoryPage.getFacets().resetPrices();
      // categoryPage.waitForSearchRequest();
      // TODO: check the interaction: just setting the value and triggeing the 'change' event is not enought
      // categoryPage.getFacets().setMinPriceRange(minPrice);
      // categoryPage.waitForSearchRequest();
      // checkProductCardsPriceFilterringByPrice(categoryPage, minPrice);

      // reset prices, change max price range
      // TODO: not commented just to have a test failure
      categoryPage.getFacets().resetPrices();
      categoryPage.waitForSearchRequest();
      categoryPage.getFacets().setMaxPriceRange(maxPrice);
      categoryPage.waitForSearchRequest();
      checkProductCardsFilterringByPrice(categoryPage, maxPrice);

      // TODO: when all these checks are done -> move these to searcy.cy.ts
      // price filterring should also work on Search page
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
