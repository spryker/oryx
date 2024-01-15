import { RouteMatcherOptions } from 'node_modules/cypress/types/net-stubbing';
import { CartData, GlueAPI } from '../apis/glue.api';
import { AbstractSFPage } from '../page-objects/abstract.page';
import { ProductStorage } from '../test-data/storages/product.storage';
import { Customer, Product } from '../types/domain.types';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      customerCleanup(api: GlueAPI): void;
      customerCartsCleanup(api: GlueAPI, user: Customer): void;
      customerAddressesCleanup(api: GlueAPI, user: Customer): void;
      failApiCall(routeMatcherOptions: RouteMatcherOptions, actionFn): void;
      checkGlobalNotificationAfterFailedApiCall(page: AbstractSFPage): void;
      createGuestCart(api: GlueAPI): void;
      createCart(api: GlueAPI): void;
      addProductToGuestCart(
        api: GlueAPI,
        numberOfItems?: number,
        product?: Product
      ): void;
      addProductToCart(
        api: GlueAPI,
        numberOfItems?: number,
        product?: Product,
        cartId?: string
      ): void;
      addAddress(api: GlueAPI, addressData?): void;
    }
  }
}

Cypress.Commands.add('customerCleanup', (api: GlueAPI) => {
  cy.fixture<Customer>('test-customer').then((customer) => {
    cy.customerCartsCleanup(api, customer);
    cy.customerAddressesCleanup(api, customer);
  });
});

Cypress.Commands.add('customerCartsCleanup', (api: GlueAPI, user: Customer) => {
  api.carts.customersGet(user.id).then((response) => {
    const carts = response.body.data;

    removeLastCart(carts);
    deleteCarts(api, carts);
  });

  // we have to create a new cart after each cleanup
  cy.createCart(api);
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
        .should('contain.text', getFailedApiCallData().apiErrorMessage);

      // when we close notification
      notifications[0].getCloseBtn().click();

      // it disappears
      notifications[0].getWrapper().should('not.exist');
      page.globalNotificationCenter.getWrapper().should('not.be.visible');
    });
  }
);

Cypress.Commands.add('createCart', (api: GlueAPI) => {
  api.carts.post();
});

Cypress.Commands.add('createGuestCart', (api: GlueAPI) => {
  api.guestCarts.get();
});

Cypress.Commands.add(
  'addProductToGuestCart',
  (api: GlueAPI, numberOfItems = 1, product = ProductStorage.getByEq(1)) => {
    api.guestCartItems.post(product, numberOfItems);
  }
);

Cypress.Commands.add(
  'addProductToCart',
  (
    api: GlueAPI,
    numberOfItems = 1,
    product = ProductStorage.getByEq(1),
    cartId?: string
  ) => {
    if (cartId) {
      api.cartItems.post(product, numberOfItems, cartId);
      return;
    }

    cy.fixture<Customer>('test-customer').then((customer) => {
      api.carts.customersGet(customer.id).then((cartData) => {
        const cartId = cartData.body.data[0].id;

        api.cartItems.post(product, numberOfItems, cartId);
      });
    });
  }
);

Cypress.Commands.add('addAddress', (api: GlueAPI, address?) => {
  cy.fixture<Customer>('test-customer').then((customer) => {
    api.addresses.post(customer.id, address);
  });
});

function removeLastCart(carts: CartData[]) {
  carts.pop();
}

function deleteCarts(api: GlueAPI, carts: CartData[]) {
  carts.map((cart) => cart.id).forEach((id) => api.carts.delete(id));
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
