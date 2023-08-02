import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';

const cartPage = new CartPage();

describe('Delete item modal suite', () => {
  beforeEach(() => {
    const api = new GlueAPI();
    api.guestCarts.get();

    cy.addProductToGuestCart(api);
    cy.goToGuestCart();
  });

  it('and empty cart should be shown if last item is removed (minus/trash icon)', () => {
    cartPage.getCartEntries().then((entries) => {
      entries[0].decreaseEntry();
      cartPage.approveCartEntryDeletion();
    });

    cartPage.checkEmptyCart();
  });

  it('and empty cart should be shown if last item is removed (0 input)', () => {
    cartPage.getCartEntries().then((entries) => {
      entries[0].changeQuantityInInput(0);
      cartPage.approveCartEntryDeletion();
    });

    cartPage.checkEmptyCart();
  });

  it('and empty cart should be shown if last item is removed (delete icon)', () => {
    cartPage.getCartEntries().then((entries) => {
      entries[0].deleteEntry();
      cartPage.approveCartEntryDeletion();
    });

    cartPage.checkEmptyCart();
  });
});
