import { RouteMatcherOptions } from 'node_modules/cypress/types/net-stubbing';
import { CartData, GlueAPI } from '../apis/glue.api';
import { AbstractSFPage } from '../page-objects/abstract.page';
import { ProductStorage } from '../test-data/storages/product.storage';
import { Product } from '../types/product.type';
import { Customer } from '../types/user.type';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      customerCartsCleanup(api: GlueAPI, user: Customer): void;
      customerAddressesCleanup(api: GlueAPI, user: Customer): void;
      failApiCall(routeMatcherOptions: RouteMatcherOptions, actionFn): void;
      checkGlobalNotificationAfterFailedApiCall(page: AbstractSFPage): void;
      addItemsToTheGuestCart(
        api: GlueAPI,
        numberOfItems: number,
        product?: Product
      ): void;
    }
  }
}

Cypress.Commands.add('customerCartsCleanup', (api: GlueAPI, user: Customer) => {
  api.carts.customersGet(user.id).then((response) => {
    const carts = response.body.data;

    removeLastCart(carts);
    deleteCarts(api, carts);
  });

  createNewCart(api);
});

Cypress.Commands.add(
  'customerAddressesCleanup',
  (api: GlueAPI, user: Customer) => {
    api.addresses.get(user.id).then((response) => {
      const addresses = response.body.data;

      addresses
        .map((address) => address.id)
        .forEach((id) => api.addresses.delete(user.id, id));
    });
  }
);

Cypress.Commands.add('failApiCall', (options, actionFn) => {
  const data = getFailedApiCallData();

  // prevents test from failing
  // if unhandled 500 error occurs
  Cypress.on('uncaught:exception', (err) => {
    return !err.message.includes(data.apiErrorMessage);
  });

  cy.intercept(options, data.failApiCallResponse).as('failedRequest');
  actionFn();
  cy.wait('@failedRequest');
});

Cypress.Commands.add(
  'checkGlobalNotificationAfterFailedApiCall',
  (page: AbstractSFPage) => {
    page.globalNotificationCenter.getCenter().should('be.visible');
    page.globalNotificationCenter.getNotifications().then((notifications) => {
      // only 1 notification is shown
      expect(notifications.length).to.be.eq(1);

      // this notification is an expected API error
      notifications[0].getType().should('be.eq', 'error');
      notifications[0].getWrapper().should('contain.text', 'Error');
      notifications[0]
        .getSubtext()
        .should('have.text', getFailedApiCallData().apiErrorMessage);

      // when we close notification
      notifications[0].getCloseBtn().click();

      // it disappears
      notifications[0].getWrapper().should('not.exist');
      page.globalNotificationCenter.getWrapper().should('not.be.visible');
    });
  }
);

Cypress.Commands.add(
  'addItemsToTheGuestCart',
  (
    api: GlueAPI,
    numberOfItems: number,
    product = ProductStorage.getByEq(1)
  ) => {
    api.guestCartItems.post(product, numberOfItems);
  }
);

function removeLastCart(carts: CartData[]) {
  carts.pop();
}

function deleteCarts(api: GlueAPI, carts: CartData[]) {
  carts.map((cart) => cart.id).forEach((id) => api.carts.delete(id));
}

function createNewCart(api: GlueAPI) {
  api.carts.post();
}

function getFailedApiCallData() {
  const failApiCallResponse = {
    statusCode: 500,
    body: 'Internal Server Error',
    forceError: false,
  };
  const apiErrorMessage = `${failApiCallResponse.statusCode} ${failApiCallResponse.body}`;

  return {
    failApiCallResponse,
    apiErrorMessage,
  };
}
