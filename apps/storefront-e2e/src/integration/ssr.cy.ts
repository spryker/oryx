import { CartPage } from '../support/page_objects/cart.page';
import { ContactPage } from '../support/page_objects/contact.page';
import { LandingPage } from '../support/page_objects/landing.page';
import { LoginPage } from '../support/page_objects/login.page';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';
import { SearchPage } from '../support/page_objects/search.page';
import { CategoryPage } from '../support/page_objects/category.page';
import { ProductStorage } from '../test-data/product.storage';
import { FooterFragment } from '../support/page_fragments/footer.fragment';
import { HeaderFragment } from '../support/page_fragments/header.fragment';
import { SearchFragment } from '../support/page_fragments/search.fragment';

const footer = new FooterFragment();
const header = new HeaderFragment();
const search = new SearchFragment();
const verifyFooter = (isPageScrollable = true) => {
  if (isPageScrollable) {
    cy.scrollTo('bottom');
  }

  footer.getLinkByUrl('/contact').should('be.visible');
  footer
    .getWrapper()
    .find('oryx-link')
    .then((footerElement) => {
      const footerText = footerElement.text();
      const currentYear = new Date().getFullYear();
      expect(footerText).to.contain(currentYear);
    });
};

const verifyHeader = () => {
  header.getLocaleSelector().should('be.visible');
  header.getCurrencySelector().should('be.visible');
  header.getUserSummaryHeading().should('be.visible');
  search.getTypeahead().should('be.visible');
};

describe('SSR suite', { tags: 'smoke' }, () => {
  it('must render Landing page', () => {
    const landingPage = new LandingPage();

    landingPage.visit();

    verifyHeader();

    landingPage.getVideo().should('be.visible');

    verifyFooter();
  });

  it('must render Product details page', () => {
    const productData = ProductStorage.getProductByEq(1);
    const pdp = new ProductDetailsPage(productData);

    pdp.visit();

    verifyHeader();

    pdp.getTitle().should('contain.text', productData.title);
    pdp.getRating().should('be.visible');
    pdp.getSKU().should('contain.text', productData.id);
    pdp.getPrice().should('contain.text', productData.originalPrice);

    pdp.getQuantityComponent().getInput().should('have.value', 1);
    pdp.getAddToCartBtn().should('be.visible');

    pdp.getImages().should('be.visible');
    pdp.getDescription().should('be.visible');
    pdp.getAttributeTerms().should('have.length', 7);

    verifyFooter();
  });

  it('must render Contact us page', () => {
    const contactPage = new ContactPage();

    contactPage.visit();

    verifyHeader();

    contactPage.getHeading().should('be.visible');

    verifyFooter(false);
  });

  it('must render Login page', () => {
    const loginPage = new LoginPage();

    loginPage.visit();

    verifyHeader();

    loginPage.loginForm.getWrapper().should('be.visible');

    verifyFooter();
  });

  it('must render Cart page', () => {
    const cartPage = new CartPage();

    cartPage.visit();

    verifyHeader();

    cartPage.getCartEntriesWrapper().should('be.visible');

    verifyFooter();
  });

  it('must render Search page', () => {
    const searchPage = new SearchPage();

    searchPage.visit();

    verifyHeader();

    searchPage.getFacets().should('be.visible');
    searchPage.getProductSort().should('be.visible');
    searchPage.getOryxCards().should('have.length.greaterThan', 1);

    verifyFooter();
  });

  it('must render Category page', () => {
    const categoryId = { id: '6' };
    const categoryPage = new CategoryPage(categoryId);

    categoryPage.visit();

    verifyHeader();

    categoryPage.getFacets().should('be.visible');
    categoryPage.getProductSort().should('be.visible');
    categoryPage.getOryxCards().should('have.length.greaterThan', 1);

    verifyFooter();
  });
});
