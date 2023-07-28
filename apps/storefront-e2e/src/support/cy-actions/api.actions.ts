import { RouteMatcherOptions } from 'node_modules/cypress/types/net-stubbing';
import { AbstractSFPage } from '../page-objects/abstract.page';
import { CartData, SCCOSApi } from '../sccos-api/sccos.api';
import { Customer } from '../types/user.type';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      customerCartsCleanup(sccosApi: SCCOSApi, user: Customer): void;
      customerAddressesCleanup(sccosApi: SCCOSApi, user: Customer): void;
      failApiCall(routeMatcherOptions: RouteMatcherOptions, actionFn): void;
      checkGlobalNotificationAfterFailedApiCall(page: AbstractSFPage): void;
    }
  }
}

Cypress.Commands.add(
  'customerCartsCleanup',
  (sccosApi: SCCOSApi, user: Customer) => {
    sccosApi.carts.customersGet(user.id).then((response) => {
      const carts = response.body.data;

      removeLastCart(carts);
      deleteCarts(sccosApi, carts);
    });

    createNewCart(sccosApi);
  }
);

Cypress.Commands.add(
  'customerAddressesCleanup',
  (sccosApi: SCCOSApi, user: Customer) => {
    sccosApi.addresses.get(user.id).then((response) => {
      const addresses = response.body.data;

      addresses
        .map((address) => address.id)
        .forEach((id) => sccosApi.addresses.delete(user.id, id));
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

function removeLastCart(carts: CartData[]) {
  carts.pop();
}

function deleteCarts(sccosApi: SCCOSApi, carts: CartData[]) {
  carts.map((cart) => cart.id).forEach((id) => sccosApi.carts.delete(id));
}

function createNewCart(sccosApi: SCCOSApi) {
  sccosApi.carts.post();
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
