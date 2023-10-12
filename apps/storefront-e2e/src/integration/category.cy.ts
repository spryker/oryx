import { checkProductCardsFilterring } from '../support/checks';
import { CategoryPage } from '../support/page-objects/category.page';

describe('Category suite', () => {
  describe('Products filtering', () => {
    let categoryPage;

    beforeEach(() => {
      categoryPage = new CategoryPage({ id: '6' });
      categoryPage.visit();
    });

    it('should update products and facets when filters are applied/cleared', () => {
      categoryPage.getFacets().setRating('4');
      categoryPage.waitForSearchRequest();
      checkProductCardsFilterring(
        categoryPage,
        2,
        1,
        'Asus Transformer Book T200TA'
      );

      // we don't expect search request here because previous query is cached
      categoryPage.getFacets().resetRating();

      const query = 'DELL Inspiron 7359';
      // apply 1st filter
      categoryPage.getFacets().setColor('Silver');
      categoryPage.waitForSearchRequest();
      checkProductCardsFilterring(categoryPage, 3, 2, query);

      // apply 2nd filter
      categoryPage.getFacets().setBrand('DELL');
      categoryPage.waitForSearchRequest();
      checkProductCardsFilterring(categoryPage, 3, 1, query);

      // clear 2nd filter
      // we don't expect search request here because previous query is cached
      categoryPage.getFacets().resetBrand();
      checkProductCardsFilterring(categoryPage, 3, 2, query);
    });
  });

  // describe('Products sorting', () => {
  //   let categoryPage;
  //
  //   beforeEach(() => {
  //     categoryPage = new CategoryPage({ id: '15' });
  //     categoryPage.visit();
  //   });
  //
  //   it('should apply default sorting when sorting is cleared', () => {
  //     // check default sorting
  //     checkProductCardsSortingBySku(categoryPage, sortingTestData.default);
  //
  //     // change sorting
  //     categoryPage
  //       .getProductSorting()
  //       .applySorting(Object.keys(sortingTestData)[2]);
  //     categoryPage.waitForSearchRequest();
  //
  //     // clear sorting and check that it is default again
  //     categoryPage.getProductSorting().clearSorting();
  //     checkProductCardsSortingBySku(categoryPage, sortingTestData.default);
  //   });
  //
  //   it('should apply all sorting options', () => {
  //     Object.keys(sortingTestData).forEach((option) => {
  //       // default options does not exist in the dropdown
  //       // we should skip it
  //       if (option === 'default') {
  //         return;
  //       }
  //
  //       cy.log(`Sorting: ${option} is applied`);
  //       categoryPage.getProductSorting().applySorting(option);
  //       categoryPage.waitForSearchRequest();
  //
  //       checkProductCardsSortingBySku(categoryPage, sortingTestData[option]);
  //     });
  //   });
  // });
});
