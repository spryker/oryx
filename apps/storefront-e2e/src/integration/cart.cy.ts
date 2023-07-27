import { CartPage } from '../support/page-objects/cart.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { SCCOSApi } from '../support/sccos-api/sccos.api';
import { ProductStorage } from '../support/test-data/storages/product.storage';

const cartPage = new CartPage();
const cartTotals = cartPage.getCartTotals();

let scosApi: SCCOSApi;

describe('Cart', () => {
  beforeEach(() => {
    scosApi = new SCCOSApi();
    scosApi.guestCarts.get();
  });

  describe('when the cart page is not visited', () => {
    describe('and discontinued items are added to cart on the product page', () => {
      const productData = ProductStorage.getProductByEq(4);
      const pdp = new ProductDetailsPage(productData);

      beforeEach(() => {
        pdp.visit();
        pdp.addItemsToTheCart(1);
      });

      describe('and the user navigates to the cart page', () => {
        beforeEach(() => {
          pdp.header.getCartSummary().click();
        });

        it(
          'should render the cart page with the newly added entries',
          { tags: 'smoke' },
          () => {
            cartPage.getCartEntriesHeading().should('be.visible');

            checkCartEntry({
              quantity: 1,
              subTotal: '€161.95',
              originalPrice: '€180.00',
              salesPrice: '€161.95',
            });

            checkCartTotals({
              subTotal: '€179.94',
              taxTotal: '€10.59',
              discountsTotal: '-€17.99',
              totalPrice: '€161.95',
            });
          }
        );
      });
    });
  });

  describe('when the cart page is visited', () => {
    describe('and the cart is empty', () => {
      beforeEach(() => {
        cy.goToCartAsGuest();
      });

      it('should render an empty message', () => {
        cartPage.checkEmptyCart();
      });
    });

    describe('and there is an item in the cart', () => {
      beforeEach(() => {
        scosApi.guestCartItems.post(ProductStorage.getProductByEq(2), 1);
        cy.goToCartAsGuest();
        cartPage.checkNotEmptyCart();
      });

      it('should render the cart entries and totals', () => {
        cartPage.getCartEntriesHeading().should('contain.text', '1 items');
        checkCartEntry({
          quantity: 1,
          subTotal: '€34.54',
          salesPrice: '€34.54',
        });
        checkCartTotals({
          subTotal: '€34.54',
          taxTotal: '€5.51',
          totalPrice: '€34.54',
        });
      });

      describe('and the entry decrease button is clicked', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0].getQuantityInput().decrease();
            cartPage.getSubmitDeleteBtn().click();
          });
        });

        it('should have an empty cart', () => {
          cartPage.checkEmptyCart();
        });
      });

      describe('and the quantity is increased by input enter', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0]
              .getQuantityInput()
              .getInput()
              .type('{selectall}4{enter}');
          });
        });

        it('should update the cart totals', () => {
          cartPage.getCartEntriesHeading().should('contain.text', '4 items');
          checkCartEntry({
            quantity: 4,
            subTotal: '€124.34',
            salesPrice: '€31.08',
          });
          checkCartTotals({
            subTotal: '€138.16',
            discountsTotal: '-€13.82',
            taxTotal: '€19.85',
            totalPrice: '€124.34',
          });
        });
      });

      describe('and the quantity is increased by input change', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0].getQuantityInput().getInput().type('{selectall}2');
          });
        });

        it('should update the cart totals after blur', () => {
          // quantity updated, but not yet recalculated prices
          cartPage.getCartEntriesHeading().should('contain.text', '1 items');
          checkCartEntry({
            quantity: 2,
            subTotal: '€34.54',
          });
          checkCartTotals({
            subTotal: '€34.54',
            taxTotal: '€5.51',
            totalPrice: '€34.54',
          });

          cy.get('body').click();

          // after blur the quantity the prices will be recalculated
          cartPage.getCartEntriesHeading().should('contain.text', '2 items');
          checkCartEntry({
            quantity: 2,
            subTotal: '€69.08',
          });
          checkCartTotals({
            subTotal: '€69.08',
            taxTotal: '€11.03',
            totalPrice: '€69.08',
          });
        });
      });

      describe('and the quantity is changed to 0', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0]
              .getQuantityInput()
              .getInput()
              .type('{selectall}0{enter}');
            cartPage.getSubmitDeleteBtn().click();
          });
        });

        it('should have an empty cart', () => {
          cartPage.checkEmptyCart();
        });
      });

      describe('and the entry is removed', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0].getRemoveBtn().click();

            cy.intercept({
              method: 'DELETE',
              url: '/guest-carts/*/guest-cart-items/*',
            }).as('deleteCartItemRequest');
            cartPage.getSubmitDeleteBtn().click();
            cy.wait('@deleteCartItemRequest');
          });
        });

        it('should have an empty cart', () => {
          cartPage.checkEmptyCart();
        });
      });

      describe('and some BE error occurs while editing cart', () => {
        beforeEach(() => {
          cy.failApiCall(
            {
              method: 'PATCH',
              url: '/guest-carts/*/guest-cart-items/*',
            },
            () => {
              cartPage.getCartEntries().then((entries) => {
                entries[0].getQuantityInput().increase();
              });
            }
          );
        });

        it('should show an error in global notification center', () => {
          cy.checkGlobalNotificationAfterFailedApiCall(cartPage);
        });
      });
    });
  });
});

function checkCartEntry(entry: {
  quantity?: number;
  subTotal?: string;
  salesPrice?: string;
  originalPrice?: string;
}) {
  cartPage.getCartEntries().then((entries) => {
    if (entry.quantity) {
      entries[0]
        .getQuantityInput()
        .getInput()
        .should('have.value', entry.quantity);
    }
    if (entry.subTotal) {
      entries[0].getSubtotal().shadow().should('contain.text', entry.subTotal);
    }
    if (entry.salesPrice) {
      entries[0]
        .getSalesPrice()
        .shadow()
        .should('contain.text', entry.salesPrice);
    }
    if (entry.originalPrice) {
      entries[0]
        .getOriginalPrice()
        .shadow()
        .should('contain.text', entry.originalPrice);
    }
  });
}

function checkCartTotals(totals: {
  subTotal?: string;
  discountsTotal?: string;
  taxTotal?: string;
  totalPrice?: string;
}) {
  cartTotals.getWrapper().should('be.visible');

  if (totals.subTotal) {
    cartTotals
      .getSubtotalPrice()
      .shadow()
      .should('contain.text', totals.subTotal);
  }

  if (totals.discountsTotal) {
    cartTotals
      .getDiscountsTotal()
      .shadow()
      .should('contain.text', totals.discountsTotal);
  } else {
    cartTotals.getDiscountsWrapper().should('not.exist');
  }

  if (totals.totalPrice) {
    cartTotals
      .getTotalPrice()
      .shadow()
      .should('contain.text', totals.totalPrice);
  }

  if (totals.taxTotal) {
    cartTotals
      .getTaxTotalPrice()
      .shadow()
      .should('contain.text', totals.taxTotal);
  }

  cartTotals
    .getTaxMessage()
    .should('be.visible')
    .and('contain.text', 'Tax included');
}
