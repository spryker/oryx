import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';
import { CheckoutPage } from '../support/page-objects/checkout.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

let api: GlueAPI;

const coupon = [
  { code: '12345wu2ca', expiredDate: '11/30/2025' },
  { code: 'sprykerze4t', expiredDate: '12/31/2037' },
];

// TODO: this might be extracted further into something bigger
// for now let's keep it here
const users = [
  {
    userType: 'guest',
    createCart: () => {
      api = new GlueAPI();

      cy.createGuestCart(api);
    },
    goToCart: () => {
      cy.goToGuestCart();
    },
    goToCheckout: () => {
      cy.goToGuestCheckout();
    },
    addProduct: () => {
      cy.addProductToGuestCart(api, 1, ProductStorage.getByEq(2));
    },
    addProductWithCoupon: () => {
      cy.addProductToGuestCart(
        api,
        1,
        ProductStorage.getProductWithCouponByEq(0)
      );
    },
    addSecondProductWithCoupon: () => {
      cy.addProductToGuestCart(
        api,
        1,
        ProductStorage.getProductWithCouponByEq(1)
      );
    },
    updateCartItemsUrl: '/guest-carts/*/guest-cart-items/*',
  },
  {
    userType: 'authenticated',
    createCart: () => {
      api = new GlueAPI();

      cy.loginApi(api);
      cy.customerCleanup(api);
      cy.createCart(api);
    },
    goToCart: () => {
      cy.goToCart();
    },
    goToCheckout: () => {
      cy.goToCheckout();
    },
    addProduct: () => {
      cy.addProductToCart(api, 1, ProductStorage.getByEq(2));
    },
    addProductWithCoupon: () => {
      cy.addProductToCart(api, 1, ProductStorage.getProductWithCouponByEq(0));
    },
    addSecondProductWithCoupon: () => {
      cy.addProductToCart(api, 1, ProductStorage.getProductWithCouponByEq(1));
    },
    updateCartItemsUrl: '/carts/*/items/*',
  },
];

describe('Cart suite', () => {
  users.forEach((user) => {
    describe(`for ${user.userType} user: `, () => {
      beforeEach(() => {
        user.createCart();
      });

      describe('without items in the cart: ', () => {
        it('should render empty cart if there are no items', () => {
          user.goToCart();
          cartPage.checkEmptyCart();
        });
      });

      describe('with items in the cart: ', () => {
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

          cartPage.getCartTotals().checkTotals({
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

          cartPage.getCartTotals().checkTotals({
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

      describe('with items in the cart and a valid coupon', () => {
        beforeEach(() => {
          user.addProductWithCoupon();
          user.goToCart();
        });

        it('should update prices if the coupon is applied', () => {
          cartPage.checkNotEmptyCart();
          cartPage.getCartEntriesHeading().should('contain.text', '1 items');

          cartPage.getCartTotals().checkTotals({
            subTotal: '€366.00',
            discountsTotal: '-€102.48',
            taxTotal: '€42.07',
            totalPrice: '€263.52',
          });

          cartPage.getCouponInput().type(coupon[0].code);
          cartPage.getCouponBtn().click();

          cartPage.getCouponNotification().should('contain.text', '12345wu2ca');
          cartPage
            .getCouponNotification()
            .invoke('attr', 'type')
            .should('eq', 'success');

          cartPage.getCouponInput().should('have.value', '');

          cartPage
            .getCouponDate()
            .shadow()
            .should('contain.text', coupon[0].expiredDate);

          cy.scrollTo('top');

          cartPage.getCartTotals().checkTotals({
            subTotal: '€366.00',
            discountsTotal: '-€202.48',
            taxTotal: '€26.11',
            totalPrice: '€163.52',
          });

          user.goToCheckout();

          checkoutPage.getCartTotals().checkTotals({
            subTotal: '€366.00',
            discountsTotal: '-€202.48',
            taxTotal: '€26.11',
            totalPrice: '€163.52',
          });
        });
      });

      describe('when invalid coupon', () => {
        beforeEach(() => {
          user.addProductWithCoupon();
          user.goToCart();
        });

        it('should show error message below input field amd keep value', () => {
          cartPage.checkNotEmptyCart();
          cartPage.getCartEntriesHeading().should('contain.text', '1 items');

          cartPage.getCartTotals().checkTotals({
            subTotal: '€366.00',
            discountsTotal: '-€102.48',
            taxTotal: '€42.07',
            totalPrice: '€263.52',
          });

          cartPage.getCouponInput().type('111111');
          cartPage.getCouponBtn().click();

          cartPage.getCouponInput().should('have.value', '111111');
          cartPage.getCouponInputError().should('be.visible');

          cy.scrollTo('top');

          cartPage.getCartTotals().checkTotals({
            subTotal: '€366.00',
            discountsTotal: '-€102.48',
            taxTotal: '€42.07',
            totalPrice: '€263.52',
          });
        });
      });

      describe('when items in the cart with multiple coupons', () => {
        beforeEach(() => {
          user.addProductWithCoupon();
          user.addSecondProductWithCoupon();
          user.goToCart();
        });

        it('should update prices if the coupon is applied', () => {
          cartPage.checkNotEmptyCart();
          cartPage.getCartEntriesHeading().should('contain.text', '2 items');

          cartPage.getCartTotals().checkTotals({
            subTotal: '€776.24',
            discountsTotal: '-€217.35',
            taxTotal: '€89.23',
            totalPrice: '€558.89',
          });

          cartPage.getCouponInput().type(coupon[0].code);
          cartPage.getCouponBtn().click();

          cartPage
            .getCouponNotification()
            .should('contain.text', coupon[0].code);
          cartPage
            .getCouponNotification()
            .invoke('attr', 'type')
            .should('eq', 'success');

          cartPage.getCouponInput().type(coupon[1].code);
          cartPage.getCouponBtn().click();

          cartPage
            .getCouponNotification()
            .should('contain.text', coupon[1].code);
          cartPage
            .getCouponNotification()
            .invoke('attr', 'type')
            .should('eq', 'success');

          cartPage.getCouponCode().should('contain.text', coupon[0].code);
          cartPage.getCouponCode().should('contain.text', coupon[1].code);

          cy.scrollTo('top');

          cartPage.getCartTotals().checkTotals({
            subTotal: '€776.24',
            discountsTotal: '-€337.86',
            taxTotal: '€69.99',
            totalPrice: '€438.38',
          });

          user.goToCheckout();

          checkoutPage.getCartTotals().checkTotals({
            subTotal: '€776.24',
            discountsTotal: '-€337.86',
            taxTotal: '€69.99',
            totalPrice: '€438.38',
          });
        });
      });

      describe('when removing coupon from a cart', () => {
        beforeEach(() => {
          user.addProductWithCoupon();
          user.goToCart();

          cartPage.getCouponInput().type(coupon[0].code);
          cartPage.getCouponBtn().click();
          cy.scrollTo('top');
        });

        it('it should update cart totals', () => {
          cartPage.getCartTotals().checkTotals({
            subTotal: '€366.00',
            discountsTotal: '-€202.48',
            taxTotal: '€26.11',
            totalPrice: '€163.52',
          });

          cartPage.getRemoveCouponBtn().click();
          cy.scrollTo('top');

          cartPage.getCartTotals().checkTotals({
            subTotal: '€366.00',
            discountsTotal: '-€102.48',
            taxTotal: '€42.07',
            totalPrice: '€263.52',
          });
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
