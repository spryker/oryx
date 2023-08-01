import { CartPage } from '../support/page-objects/cart.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { SCCOSApi } from '../support/sccos-api/sccos.api';
import { ProductStorage } from '../support/test-data/storages/product.storage';

let sccosApi: SCCOSApi;

const cartPage = new CartPage();

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
        const pdp = new ProductDetailsPage(ProductStorage.getProductByEq(0));

        pdp.visit();

        pdp.addItemsToTheCart(1);
        pdp.header.checkCartCount(1);

        pdp.addItemsToTheCart(1, true);
        pdp.header.checkCartCount(2);
      });

      it('a product is added in the cart from cart (input, manual)', () => {
        addItemsInTheGuestCart(1);
        cy.goToCartAsGuest();

        cartPage.header.checkCartCount(1);

        cartPage.getCartEntries().then((cartEntries) => {
          cartEntries[0].changeQuantityInInput(2);

          cartPage.header.checkCartCount(2);
        });
      });
    });

    context('must decrease if', () => {
      it('a product is removed from the cart (- btn click)', () => {
        addItemsInTheGuestCart(2);
        cy.goToCartAsGuest();

        cartPage.header.checkCartCount(2);

        cartPage.getCartEntries().then((cartEntries) => {
          cartEntries[0].removeEntry();

          cartPage.header.checkCartCount(1);
        });
      });
    });

    context('must be not visible if', () => {
      it('all items are removed from the cart (trash btn click)', () => {
        addItemsInTheGuestCart(1);
        cy.goToCartAsGuest();

        cartPage.header.checkCartCount(1);

        cartPage.getCartEntries().then((entries) => {
          entries[0].removeEntry();
          cartPage.approveCartEntryDeletion();

          cartPage.header.checkCartCount(0);
        });
      });

      it('all items are removed from the cart (X btn click)', () => {
        addItemsInTheGuestCart(2);
        cy.goToCartAsGuest();

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

function addItemsInTheGuestCart(numberOfItems: number) {
  sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), numberOfItems);
}
