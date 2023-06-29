import { CartPage } from '../support/page_objects/cart.page';
import { ContactPage } from '../support/page_objects/contact.page';
import { LandingPage } from '../support/page_objects/landing.page';
import { LoginPage } from '../support/page_objects/login.page';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';
import { ProductStorage } from '../test-data/product.storage';

describe('SSR suite', { tags: 'smoke' }, () => {
  it('must render Landing page', () => {
    const landingPage = new LandingPage();

    landingPage.visit();
    landingPage.getVideo().should('be.visible');
  });

  it('must render Product details page', () => {
    const productData = ProductStorage.getProductByEq(1);
    const pdp = new ProductDetailsPage(productData);

    pdp.visit();

    pdp.getTitle().should('contain.text', productData.title);
    pdp.getRating().should('be.visible');
    pdp.getSKU().should('contain.text', productData.id);
    pdp.getPrice().should('contain.text', productData.originalPrice);

    pdp.getQuantityComponent().getInput().should('have.value', 1);
    pdp.getAddToCartBtn().should('be.visible');

    pdp.getImages().should('be.visible');
    pdp.getDescription().should('be.visible');
    pdp.getAttributeTerms().should('have.length', 7);
  });

  it('must render Contact us page', () => {
    const contactPage = new ContactPage();

    contactPage.visit();
    contactPage.getHeading().should('be.visible');
  });

  it('must render Login page', () => {
    const loginPage = new LoginPage();

    loginPage.visit();
    loginPage.loginForm.getWrapper().should('be.visible');
  });

  it('must render Cart page', () => {
    const cartPage = new CartPage();

    cartPage.visit();
    cartPage.getCartEntriesWrapper().should('be.visible');
  });
});
