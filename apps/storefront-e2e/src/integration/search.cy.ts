import { LandingPage } from '../support/page_objects/landing.page';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';
import { ProductStorage } from '../test-data/product.storage';

const landingPage = new LandingPage();
const search = landingPage.search;

describe('Search suite', () => {
  beforeEach(() => {
    landingPage.visit();
  });

  it('must show search results', () => {
    search.search('sony');

    search.getSearchSuggestions().should('have.length', 5);
    search
      .getSearchSuggestions()
      .find('a')
      .eq(0)
      .should('contain.text', 'sony');

    search.getSearchProducts().should('have.length', 5);
    search
      .getSearchProducts()
      .find('oryx-product-title')
      .eq(0)
      .shadow()
      .should('contain.text', 'Sony NEX-VG20EH');

    search.getViewAllBtn().should('be.visible');
    search.clearSearch();
  });

  it('must go to PDP from search results', { tags: 'smoke' }, () => {
    const productData = ProductStorage.getProductByEq(3);
    const pdp = new ProductDetailsPage(productData);

    search.search(productData.title);

    search.getSearchProducts().eq(0).click();

    // check if correct PDP was opened
    pdp.getTitle().should('contain.text', productData.title);
    pdp.getSKU().should('contain.text', productData.id);
  });

  it('must show "No results" message', () => {
    search.search('test123');

    search.getSearchResultsWrapper().should('not.exist');

    search
      .getEmptySearchResults()
      .should('be.visible')
      .and('contain.text', 'No results test123');
  });
});
