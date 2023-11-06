import {
  checkProductCardsFilteringByName,
  checkProductCardsFilteringByPrice,
  checkProductCardsPriceMode,
  checkProductCardsSortingBySku,
} from '../support/checks';
import { CategoryPage } from '../support/page-objects/category.page';
import { sortingTestData } from '../support/test-data/search-products';
import { ProductStorage } from '../support/test-data/storages/product.storage';

describe('Category suite', () => {
  let categoryPage;

  describe('Products filtering', () => {
    describe('by value facets', () => {
      beforeEach(() => {
        categoryPage = new CategoryPage({ id: '6' });
        categoryPage.visit();
      });

      it('should update products and facets when filters are applied/cleared', () => {
        categoryPage.getFacets().setRating('4');
        categoryPage.waitForSearchRequest();
        checkProductCardsFilteringByName(
          categoryPage,
          2,
          1,
          'Asus Transformer Book T200TA'
        );

        // we don't expect search request here because previous query is cached
        categoryPage.getFacets().resetRating();
        categoryPage.waitForSearchRequest(true);

        const query = 'DELL Inspiron 7359';
        // apply 1st filter
        categoryPage.getFacets().setColor('Silver');
        categoryPage.waitForSearchRequest();
        checkProductCardsFilteringByName(categoryPage, 4, 2, query);

        // apply 2nd filter
        categoryPage.getFacets().setBrand('DELL');
        categoryPage.waitForSearchRequest();
        checkProductCardsFilteringByName(categoryPage, 4, 1, query);

        // clear 2nd filter
        // we don't expect search request here because previous query is cached
        categoryPage.getFacets().resetBrand();
        categoryPage.waitForSearchRequest(true);
        checkProductCardsFilteringByName(categoryPage, 4, 2, query);
      });
    });

    describe('by price', () => {
      const minPrice = 200;
      const maxPrice = 400;

      beforeEach(() => {
        // set brand to limit a number of products displayed
        // and avoid issues with concrete products displaying
        categoryPage = new CategoryPage({ id: '2', search: 'brand=Kodak' });
        categoryPage.visit();
      });

      it('should apply price filtering', () => {
        cy.log('set minimum price');
        categoryPage.getFacets().setMinPrice(minPrice);
        categoryPage.waitForSearchRequest();
        checkProductCardsFilteringByPrice(categoryPage, minPrice);

        cy.log('reset prices, set max price');
        categoryPage.getFacets().resetPrices();
        categoryPage.waitForSearchRequest(true);
        categoryPage.getFacets().setMaxPrice(maxPrice);
        categoryPage.waitForSearchRequest();
        checkProductCardsFilteringByPrice(categoryPage, 0, maxPrice);

        cy.log('reset prices, change min price range');
        categoryPage.getFacets().resetPrices();
        categoryPage.waitForSearchRequest(true);
        categoryPage.getFacets().setMinPriceRange(minPrice);
        categoryPage.waitForSearchRequest(true);
        checkProductCardsFilteringByPrice(categoryPage, minPrice);

        cy.log('reset prices, change max price range');
        categoryPage.getFacets().resetPrices();
        categoryPage.waitForSearchRequest(true);
        categoryPage.getFacets().setMaxPriceRange(maxPrice);
        categoryPage.waitForSearchRequest(true);
        checkProductCardsFilteringByPrice(categoryPage, 0, maxPrice);
      });
    });
  });

  describe('Products sorting', () => {
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
      categoryPage.waitForSearchRequest(true);
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

  describe('Product price mode change', { tags: 'b2b' }, () => {
    beforeEach(() => {
      categoryPage = new CategoryPage({ id: '7' });
      categoryPage.visit();
    });

    it('should update price when price mode changes', () => {
      const productData = ProductStorage.getByEq(5);

      checkProductCardsPriceMode(categoryPage, productData.originalPrice);

      categoryPage.header.changePriceMode('NET_MODE');
      checkProductCardsPriceMode(categoryPage, productData.netModePrice);

      categoryPage.header.changePriceMode('GROSS_MODE');
      checkProductCardsPriceMode(categoryPage, productData.originalPrice);
    });
  });
});
