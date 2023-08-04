import { LandingPage } from '../support/page-objects/landing.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';
import { searchDataStorage } from '../support/test-data/storages/search-box.storage';

const landingPage = new LandingPage();
const searchbox = landingPage.searchbox;

describe('Search box suite', () => {
  beforeEach(() => {
    landingPage.visit();
  });

  it('should show correct search results based on input', () => {
    const searchData = searchDataStorage[0];

    // valid search
    searchbox.search(searchData.query);
    verifySearchResults(searchData);

    // clear search
    searchbox.clearSearch();
    searchbox.getSearchResultsWrapper().should('not.exist');

    // empty search
    searchbox.search('test123');
    verifyEmptySearchResults();
  });

  it('should navigate to PDP from search results', { tags: 'smoke' }, () => {
    const productData = ProductStorage.getByEq(3);
    const pdp = new ProductDetailsPage(productData);

    searchbox.search(productData.title);
    searchbox.clickOnProduct(0);

    pdp.checkDefaultProduct();
  });
});

function verifySearchResults(searchData) {
  searchbox
    .getSearchSuggestions()
    .should('have.length', searchData.suggestionsCount);
  searchbox
    .getSearchSuggestions()
    .find('a')
    .eq(0)
    .should('contain.text', searchData.firstSuggestion);

  searchbox.getSearchProducts().should('have.length', searchData.productCount);
  searchbox
    .getSearchProducts()
    .find('oryx-product-title')
    .eq(0)
    .shadow()
    .should('contain.text', searchData.firstProductTitle);

  searchbox.getViewAllBtn().should('be.visible');
}

function verifyEmptySearchResults() {
  searchbox.getSearchResultsWrapper().should('not.exist');
  searchbox.getEmptySearchResults().should('be.visible');
}
