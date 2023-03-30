import { ProductStorage } from '../data-storages/product.storage';
import { CartPage } from '../support/page_objects/cart.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';

const cartPage = new CartPage();
const cartTotals = cartPage.getCartTotals();

let scosApi: SCCOSApi;

describe('Cart', () => {
  beforeEach(() => {
    scosApi = new SCCOSApi();
    scosApi.guestCarts.get();
  });

  describe('when the cart page is visited', () => {
    describe('and the cart is empty', () => {
      beforeEach(() => {
        cartPage.visit();
      });

      it('should render an empty message', () => {
        cartPage.getCartTotals().getCartSummaryQuantity().should('not.exist');
        cartPage
          .getCartEntriesWrapper()
          .contains('Your shopping cart is empty')
          .should('be.visible');
        cartPage.getCartTotals().getWrapper().should('not.be.visible');
      });

      // TODO: navigate back and forth to product page and add item to cart
      // describe('and when an item is added', () => {
      //   it('should render the cart entries and totals', () => {});
      // });
    });

    describe('and there is an item in cart', () => {
      beforeEach(() => {
        scosApi.guestCartItems.post(ProductStorage.getProductByEq(2), 1);
        cartPage.visit();
      });

      it('should render the cart content', () => {
        cartPage.getCartTotals().getWrapper().should('be.visible');
        // check cart summary whether the badge is updated accordingly
        // cartPage
        //   .getCartTotals()
        //   .getCartSummaryQuantity()
        //   .should('have.value', '1');
        checkCartEntry({
          quantity: 1,
          subTotal: '€62.77',
          originalPrice: '€70.00',
          salesPrice: '€62.77',
        });
        checkCartTotals({
          subTotal: '€62.77',
          taxTotal: '€4.11',
          totalPrice: '€62.77',
        });
      });

      describe('and when the quantity is increased by input enter', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0]
              .getQuantityInput()
              .getInput()
              .type('{selectall}5{enter}');
          });
        });

        it('should update the cart totals', () => {
          // check cart summary whether the badge is updated accordingly
          // cartPage
          //   .getCartTotals()
          //   .getCartSummaryQuantity()
          //   .should('have.value', '5');
          checkCartEntry({
            quantity: 5,
            subTotal: '€282.46',
            originalPrice: '€70.00',
            salesPrice: '€62.77',
          });
          checkCartTotals({
            subTotal: '€313.85',
            discountsTotal: '-€31.39',
            taxTotal: '€18.48',
            totalPrice: '€282.46',
          });
        });
      });

      describe('and when the quantity is increased by input change', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0].getQuantityInput().getInput().type('{selectall}2');
          });
        });

        it('should update the cart totals after blur', () => {
          // quantity updated, but not yet recalculated prices
          checkCartEntry({
            quantity: 2,
            subTotal: '€62.77',
          });
          checkCartTotals({
            subTotal: '€62.77',
            taxTotal: '€4.11',
            totalPrice: '€62.77',
          });

          cy.get('body').click();

          // after blur the quantity the prices will be recalculated
          checkCartEntry({
            quantity: 2,
            subTotal: '€112.99',
          });
          checkCartTotals({
            subTotal: '€125.54',
            taxTotal: '€7.39',
            discountsTotal: '-€12.55',
            totalPrice: '€112.99',
          });
        });
      });

      describe('and when the quantity is changed to 0', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0]
              .getQuantityInput()
              .getInput()
              .type('{selectall}0{enter}');
          });
        });

        it('should have an empty cart', () => {
          cartPage
            .getCartEntriesWrapper()
            .contains('Your shopping cart is empty')
            .should('be.visible');
          cartPage.getCartTotals().getWrapper().should('not.be.visible');
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
      entries[0].getSubtotal().should('contain.text', entry.subTotal);
    }
    if (entry.salesPrice) {
      entries[0].getSalesPrice().should('contain.text', entry.salesPrice);
    }
    if (entry.originalPrice) {
      entries[0].getOriginalPrice().should('contain.text', entry.originalPrice);
    }
  });
}

function checkCartTotals(totals: {
  subTotal?: string;
  discountsTotal?: string;
  taxTotal?: string;
  totalPrice?: string;
}) {
  if (totals.subTotal) {
    cartTotals.getSubtotalPrice().should('contain.text', totals.subTotal);
  }

  if (totals.discountsTotal) {
    cartTotals
      .getDiscountsTotal()
      .should('contain.text', totals.discountsTotal);
  } else {
    cartTotals.getDiscountsWrapper().should('not.exist');
  }

  if (totals.totalPrice) {
    cartTotals.getTotalPrice().should('contain.text', totals.totalPrice);
  }

  // // covers HRZ-1008
  if (totals.taxTotal) {
    cartTotals.getTaxTotalPrice().should('contain.text', totals.taxTotal);
  }
  // cartTotals
  //   .getTaxMessage()
  //   .should('be.visible')
  //   .and('contain.text', 'Tax included');
}
