import { CartPage } from '../support/page_objects/cart.page';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';
import { ProductStorage } from '../test-data/product.storage';

const cartPage = new CartPage();
const cartTotals = cartPage.getCartTotals();

let scosApi: SCCOSApi;

describe('Cart', () => {
  beforeEach(() => {
    scosApi = new SCCOSApi();
    scosApi.guestCarts.get();
  });

  describe('when the cart page is not visited', () => {
    describe('and items are added to cart on the product page', () => {
      const productData = ProductStorage.getProductByEq(2);
      const pdp = new ProductDetailsPage(productData);

      beforeEach(() => {
        pdp.visit();
        pdp.hydrateAddToCart();
        pdp.addItemsToTheCart(1);
      });

      describe('and the user navigates to the cart page', () => {
        beforeEach(() => {
          pdp.header.getCartSummary().click();
        });

        it('should render the cart page with the newly added entries', () => {
          cartPage.getCartEntriesHeading().should('contain.text', '1 items');
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
      });
    });
  });

  describe('when the cart page is visited', () => {
    describe('and the cart is empty', () => {
      beforeEach(() => {
        cartPage.visit();
      });

      it('should render an empty message', () => {
        cartPage
          .getCartEntriesWrapper()
          .contains('Your shopping cart is empty')
          .should('be.visible');

        cartPage.getCartEntriesHeading().should('not.exist');
        cartPage.getCartTotals().getWrapper().should('not.be.visible');
      });
    });

    describe('and there is an item in cart', () => {
      beforeEach(() => {
        scosApi.guestCartItems.post(ProductStorage.getProductByEq(2), 1);
        cartPage.visit();
      });

      it('should render the cart entries and totals', () => {
        cartPage.getCartEntriesHeading().should('contain.text', '1 items');
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

      describe('and the entry decrease button is clicked', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0].getQuantityInput().decrease();
          });
        });

        it('should have an empty cart', () => {
          checkEmptyCart();
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
            subTotal: '€225.97',
            originalPrice: '€70.00',
            salesPrice: '€62.77',
          });
          checkCartTotals({
            subTotal: '€251.08',
            discountsTotal: '-€25.11',
            taxTotal: '€14.78',
            totalPrice: '€225.97',
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
            subTotal: '€62.77',
          });
          checkCartTotals({
            subTotal: '€62.77',
            taxTotal: '€4.11',
            totalPrice: '€62.77',
          });

          cy.get('body').click();

          // after blur the quantity the prices will be recalculated
          cartPage.getCartEntriesHeading().should('contain.text', '2 items');
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
          checkEmptyCart();
        });
      });

      describe('and the entry is removed', () => {
        beforeEach(() => {
          cartPage.getCartEntries().then((entries) => {
            entries[0].getRemoveBtn().click();
            cartPage.getSubmitDeleteBtn().click();
          });
        });

        it('should have an empty cart', () => {
          checkEmptyCart();
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
  cartTotals.getWrapper().should('be.visible');

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

  if (totals.taxTotal) {
    cartTotals.getTaxTotalPrice().should('contain.text', totals.taxTotal);
  }

  cartTotals
    .getTaxMessage()
    .should('be.visible')
    .and('contain.text', 'Tax included');
}

function checkEmptyCart() {
  cartPage
    .getCartEntriesWrapper()
    .contains('Your shopping cart is empty')
    .should('be.visible');
  cartPage.getCartTotals().getWrapper().should('not.be.visible');
}
