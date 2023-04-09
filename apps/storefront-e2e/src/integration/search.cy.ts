import { ProductStorage } from '../test-data/product.storage';
import { LandingPage } from '../support/page_objects/landing.page';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';

const landingPage = new LandingPage();
const search = landingPage.search;

describe('Search suite', () => {
  beforeEach(() => {
    landingPage.visit();
  });

  it('must show search results', () => {
    search.search('sony');

    search.getSearchSuggestions().should('have.length', 5);
    search.getSearchSuggestions().find('a').eq(0).should('have.text', 'sony');

    search.getSearchProducts().should('have.length', 5);
    search
      .getSearchProducts()
      .find('oryx-product-title')
      .eq(0)
      .shadow()
      .should('contain.text', 'Sony NEX-VG20EH');

    search.getSearchResultsContainer().scrollTo('bottom');

    search.getViewAllBtn().should('be.visible');

    search.clearSearch();
  });

  it('must go to PDP from search results', () => {
    const productData = ProductStorage.getProductByEq(2);
    const pdp = new ProductDetailsPage(productData);

    cy.intercept('**/concrete-products/**').as('productRequest');

    search.search(productData.title);

    search.getSearchProducts().eq(0).find('a').click();

    pdp.getTitle().should('contain.text', productData.title);
    pdp.getSKU().should('contain.text', productData.id);
  });

  it('must show "Nothing found" message', () => {
    search.search('test123');

    search.getSearchResultsWrapper().should('not.exist');

    search
      .getEmptySearchResults()
      .should('be.visible')
      .and('contain.text', 'Nothing found');
  });
});
