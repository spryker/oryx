import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

let api: GlueAPI;
const cartPage = new CartPage();

describe('Cart summary suite', () => {
  beforeEach(() => {
    api = new GlueAPI();

    cy.createGuestCart(api);
  });

  context('counter: ', () => {
    it('should increase if a product is added from pdp', () => {
      const pdp = new ProductDetailsPage(ProductStorage.getByEq(0));

      pdp.visit();

      pdp.addItemsToTheCart(1);
      pdp.header.checkCartCount(1);

      pdp.addItemsToTheCart(1, true);
      pdp.header.checkCartCount(2);
    });

    it('should increase if a product is added from cart (input)', () => {
      cy.addProductToGuestCart(api, 1);
      cy.goToGuestCart();

      cartPage.header.checkCartCount(1);

      cartPage.getCartEntries().then((cartEntries) => {
        cartEntries[0].changeQuantityInInput(2);

        cartPage.header.checkCartCount(2);
      });
    });

    it('should decrease if a product is removed from the cart (- btn click)', () => {
      cy.addProductToGuestCart(api, 2);
      cy.goToGuestCart();

      cartPage.header.checkCartCount(2);

      cartPage.getCartEntries().then((cartEntries) => {
        cartEntries[0].decreaseEntry();

        cartPage.header.checkCartCount(1);
      });
    });

    it('should dissapear if all items are removed from the cart (trash btn click)', () => {
      cy.addProductToGuestCart(api, 1);
      cy.goToGuestCart();

      cartPage.header.checkCartCount(1);

      cartPage.getCartEntries().then((entries) => {
        entries[0].decreaseEntry();
        cartPage.approveCartEntryDeletion();

        cartPage.header.checkCartCount(0);
      });
    });

    it('should dissapear if all items are removed from the cart (X btn click)', () => {
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
