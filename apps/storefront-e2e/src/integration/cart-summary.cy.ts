import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

let api: GlueAPI;

const cartPage = new CartPage();

// Cart summary is an element that navigates you to the cart
// and shows the # of items added to the cart in Counter
//
// There are a lot of actions after which Counter is changes
// and this suite should cover all these integrations
describe('Cart summary suite', () => {
  beforeEach(() => {
    api = new GlueAPI();
    api.guestCarts.get();
  });

  context('Counter', () => {
    context('must increase if', () => {
      it('a product is added in the cart from pdp', () => {
        const pdp = new ProductDetailsPage(ProductStorage.getByEq(0));

        pdp.visit();

        pdp.addItemsToTheCart(1);
        pdp.header.checkCartCount(1);

        pdp.addItemsToTheCart(1, true);
        pdp.header.checkCartCount(2);
      });

      it('a product is added in the cart from cart (input, manual)', () => {
        cy.addProductToGuestCart(api, 1);
        cy.goToGuestCart();

        cartPage.header.checkCartCount(1);

        cartPage.getCartEntries().then((cartEntries) => {
          cartEntries[0].changeQuantityInInput(2);

          cartPage.header.checkCartCount(2);
        });
      });
    });

    context('must decrease if', () => {
      it('a product is removed from the cart (- btn click)', () => {
        cy.addProductToGuestCart(api, 2);
        cy.goToGuestCart();

        cartPage.header.checkCartCount(2);

        cartPage.getCartEntries().then((cartEntries) => {
          cartEntries[0].decreaseEntry();

          cartPage.header.checkCartCount(1);
        });
      });
    });

    context('must be not visible if', () => {
      it('all items are removed from the cart (trash btn click)', () => {
        cy.addProductToGuestCart(api, 1);
        cy.goToGuestCart();

        cartPage.header.checkCartCount(1);

        cartPage.getCartEntries().then((entries) => {
          entries[0].decreaseEntry();
          cartPage.approveCartEntryDeletion();

          cartPage.header.checkCartCount(0);
        });
      });

      it('all items are removed from the cart (X btn click)', () => {
        cy.addProductToGuestCart(api, 2);
        cy.goToGuestCart();

        cartPage.header.checkCartCount(2);

        cartPage.getCartEntries().then((entries) => {
          entries[0].deleteEntry();
          cartPage.approveCartEntryDeletion();

          cartPage.header.checkCartCount(0);
        });
      });
    });
  });
});
