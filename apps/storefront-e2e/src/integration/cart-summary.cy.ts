import { CartPage } from '../support/page_objects/cart.page';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';
import { ProductStorage } from '../test-data/product.storage';

let sccosApi: SCCOSApi;

const cartPage = new CartPage();
const pdp = new ProductDetailsPage(ProductStorage.getProductByEq(0));

// Cart summary is an element that navigates you to the cart
// and shows the # of items added to the cart in Counter
//
// There are a lot of actions after which Counter is changes
// and this suite should cover all these integrations
describe('Cart summary suite', () => {
  beforeEach(() => {
    sccosApi = new SCCOSApi();
    sccosApi.guestCarts.get();
  });

  context('Counter', () => {
    context('must increase if', () => {
      it('a product is added in the cart from pdp', () => {
        pdp.visit();

        pdp.addItemsToTheCart(1);
        pdp.header.getCartCount().should('be.visible').and('contain.text', '1');

        pdp.addItemsToTheCart(1, true);
        pdp.header.getCartCount().should('be.visible').and('contain.text', '2');
      });

      it('a product is added in the cart from cart (input, manual)', () => {
        sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 1);

        cartPage.visit();

        cartPage.header.getCartCount().should('contain.text', '1');

        cartPage.getCartEntries().then((entries) => {
          entries[0].getQuantityInput().getInput().type('{selectall}2');
          cy.get('body').click();

          cartPage.header.getCartCount().should('contain.text', '2');
        });
      });
    });

    context('must decrease if', () => {
      it('a product is removed from the cart (- btn click)', () => {
        sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 2);
        cartPage.visit();

        cartPage.header.getCartCount().should('contain.text', '2');

        cartPage.getCartEntries().then((entries) => {
          entries[0].getQuantityInput().decrease();

          cartPage.header.getCartCount().should('contain.text', '1');
        });
      });
    });

    context('must be not visible if', () => {
      it('all items are removed from the cart (trash btn click)', () => {
        sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 1);
        cartPage.visit();

        cartPage.header.getCartCount().should('contain.text', '1');

        cartPage.getCartEntries().then((entries) => {
          entries[0].getQuantityInput().decrease();
          cartPage.getSubmitDeleteBtn().click();

          cartPage.header.getCartCount().should('not.exist');
        });
      });

      it('all items are removed from the cart (X btn click)', () => {
        sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 2);
        cartPage.visit();

        cartPage.header.getCartCount().should('contain.text', '2');

        cartPage.getCartEntries().then((entries) => {
          entries[0].remove();
          cartPage.getSubmitDeleteBtn().click();

          cartPage.header.getCartCount().should('not.exist');
        });
      });
    });
  });
});
