import { GlueAPI } from '../support/apis/glue.api';
import { CartsPage } from '../support/page-objects/multi-cart/carts.page';
import { CreateCartPage } from '../support/page-objects/multi-cart/create-cart.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

const cartsPage = new CartsPage();
const createCartPage = new CreateCartPage();

let api: GlueAPI;

const cartName = 'test-cart-name';

interface FormValues {
  name: string;
  currency?: string;
  priceMode?: string;
}

describe('Carts suite', () => {
  beforeEach(() => {
    api = new GlueAPI();
    cy.loginApi(api);
    cy.customerCleanup(api);
  });

  it(
    `should create and remove cart with name: ${cartName}`,
    { tags: 'b2b' },
    () => {
      cartsPage.visit();

      cartsPage.getCreateCartButton().click({ force: true });
      cy.location('pathname').should('be.eq', createCartPage.url);

      fillAndSubmitForm({ name: cartName });

      //create a cart and add it to the page
      cartsPage.getCartByName(cartName).should('exist');
      //cart created notification is shown
      //TODO: use full message text when API will be fixed
      // shouldShowNotificationWithText(`Cart ${cartName} created`);
      shouldShowNotificationWithText(`Cart ${cartName}`);

      addProduct();

      removeCart();
    }
  );
});

function fillAndSubmitForm({ name, currency, priceMode }: FormValues) {
  cy.intercept('POST', '/carts').as('createCart');

  createCartPage.getCartNameInput().type(name);

  if (currency) {
    createCartPage.getCartCurrencyField().select(currency);
  }

  if (priceMode) {
    createCartPage.getCartPriceModeField().select(priceMode);
  }

  createCartPage.getSubmitButton().click();

  cy.wait('@createCart');
  //redirect to carts page after cart creation
  cy.location('pathname').should('be.eq', cartsPage.url);
}

function shouldShowNotificationWithText(name: string) {
  cartsPage.globalNotificationCenter
    .getNotifications()
    .then((notifications) => {
      notifications.find((notification) =>
        notification.getWrapper().should('contain.text', name)
      );
    });
}

function addProduct() {
  cartsPage
    .getCartByName(cartName)
    .invoke('attr', 'cartId')
    .then((cartId) => {
      cy.addProductToCart(api, 1, ProductStorage.getByEq(2), cartId);

      //refresh page to show product inside the cart
      cy.reload();

      //open the collapsible
      cartsPage.getCartByName(cartName).find('summary').click({ force: true });
      //product is added to the cart
      cartsPage
        .getCartByName(cartName)
        .find('oryx-cart-entry')
        .should('be.visible');
    });
}

function removeCart() {
  cartsPage.getRemoveCartButton(cartName).find('button').click({ force: true });

  //show the confirmation modal
  cartsPage.getRemoveCartModal(cartName).as('modal');
  cy.get('@modal').should('have.attr', 'open');

  cy.intercept('DELETE', '/carts/**').as('removeCart');
  cy.get('@modal').find('oryx-button').contains('button', 'Remove').click();
  cy.wait('@removeCart');

  //cart is removed from the page
  cartsPage
    .getCartsList()
    .find('oryx-cart-list-item')
    .contains(cartName)
    .should('not.exist');
  //cart removed notification is shown
  shouldShowNotificationWithText(`${cartName} removed`);
}
