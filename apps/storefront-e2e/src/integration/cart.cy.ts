import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';
import { Customer } from '../support/types/user.type';

const cartPage = new CartPage();
const cartTotals = cartPage.getCartTotals();

let api: GlueAPI;

const users = [
  {
    userType: 'guest',
    createCart: () => {
      api = new GlueAPI();
      api.guestCarts.get();
    },
    goToCart: () => {
      cy.goToGuestCart();
    },
    addProduct: () => {
      cy.addProductToGuestCart(api, 1, ProductStorage.getByEq(2));
    },
    updateCartItemsUrl: '/guest-carts/*/guest-cart-items/*',
  },
  {
    userType: 'authenticated',
    createCart: () => {
      api = new GlueAPI();
      cy.loginApi();
      cy.fixture<Customer>('test-customer').then((customer) => {
        cy.customerCartsCleanup(api, customer);
      });

      api.carts.post();
    },
    goToCart: () => {
      cy.goToCart();
    },
    addProduct: () => {
      cy.addProductToCart(api, 1, ProductStorage.getByEq(2));
    },
    updateCartItemsUrl: '/carts/*/items/*',
  },
];

describe('Cart suite', () => {
  users.forEach((user) => {
    context(`For ${user.userType} user: `, () => {
      beforeEach(() => {
        user.createCart();
      });

      it('should render empty cart if there are no items', () => {
        user.goToCart();
        cartPage.checkEmptyCart();
      });

      context('For cart with items: ', () => {
        beforeEach(() => {
          user.addProduct();
          user.goToCart();
        });

        it('should update prices if the number of items was changed', () => {
          cartPage.checkNotEmptyCart();
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

          // change the number of items
          cartPage.getCartEntries().then((entries) => {
            entries[0].changeQuantityInInput(4);
          });

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

        it('should show a global error if an error occurs while cart editing', () => {
          cy.failApiCall(
            {
              method: 'PATCH',
              url: user.updateCartItemsUrl,
            },
            () => {
              cartPage.getCartEntries().then((entries) => {
                entries[0].increaseEntry();
              });
            }
          );

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
