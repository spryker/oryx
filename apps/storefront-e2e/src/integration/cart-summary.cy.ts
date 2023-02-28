import { ProductStorage } from '../data-storages/product.storage';
import { CartPage } from '../support/page_objects/cart.page';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';

let sccosApi: SCCOSApi;

const cartPage = new CartPage();
const pdp = new ProductDetailsPage(ProductStorage.getProductByEq(0));

describe('Cart summary spec', () => {
  beforeEach(() => {
    sccosApi = new SCCOSApi();
    sccosApi.getGuestCarts();
  });

  context('Counter', () => {
    it('HRZ-1406 | must not exist if cart is empty', () => {
      cartPage.visit();
      cartPage.header.getCartCount().should('not.exist');
    });

    it('HRZ-1409 | must increase # of items if added from pdp', () => {
      pdp.visit();
      pdp.addItemsToTheCart(1);

      pdp.header.getCartCount().should('be.visible').and('contain.text', '1');

      pdp.addItemsToTheCart(1);

      pdp.header.getCartCount().should('be.visible').and('contain.text', '2');
    });

    it('HRZ-1410 | must increase # of items if increased in cart (+ btn click)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 1);
      cartPage.visit();

      cartPage.header.getCartCount().should('contain.text', '1');

      cartPage.getCartEntries().then((entries) => {
        entries[0].getQuantityInput().increase();

        cartPage.header.getCartCount().should('contain.text', '2');
      });
    });

    it('HRZ-1410 | must increase # of items if increased in cart (input, manual)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 1);

      cartPage.visit();

      cartPage.header.getCartCount().should('contain.text', '1');

      cartPage.getCartEntries().then((entries) => {
        entries[0].getQuantityInput().getInput().type('{selectall}2');
        cy.get('body').click();

        cartPage.header.getCartCount().should('contain.text', '2');
      });
    });

    it('HRZ-1411 | must decrease # of items if decreased in cart (- btn click)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 2);
      cartPage.visit();

      cartPage.header.getCartCount().should('contain.text', '2');

      cartPage.getCartEntries().then((entries) => {
        entries[0].getQuantityInput().decrease();

        cartPage.header.getCartCount().should('contain.text', '1');
      });
    });

    it('HRZ-1411 | must decrease # of items if decreased in cart (input, manual)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 2);

      cartPage.visit();

      cartPage.header.getCartCount().should('contain.text', '2');

      cartPage.getCartEntries().then((entries) => {
        entries[0].getQuantityInput().getInput().type('{selectall}1');
        cy.get('body').click();

        cartPage.header.getCartCount().should('contain.text', '1');
      });
    });

    it('HRZ-1407 | must not exist if all items are removed from the cart (trash btn click)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 1);
      cartPage.visit();

      cartPage.header.getCartCount().should('contain.text', '1');

      cartPage.getCartEntries().then((entries) => {
        entries[0].getQuantityInput().decrease();

        cartPage.header.getCartCount().should('not.exist');
      });
    });

    it('HRZ-1408 | must not exist if all items are removed from the cart (X btn click)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 2);
      cartPage.visit();

      cartPage.header.getCartCount().should('contain.text', '2');

      cartPage.getCartEntries().then((entries) => {
        entries[0].remove();

        cartPage.header.getCartCount().should('not.exist');
      });
    });
  });
});
