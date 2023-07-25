import { RouteMatcherOptions } from 'node_modules/cypress/types/net-stubbing';
import { TestCustomerData } from '../types/user.type';
import { AbstractSFPage } from './page_objects/abstract.page';
import { CartPage } from './page_objects/cart.page';
import { LoginPage } from './page_objects/login.page';
import { SCCOSApi } from './sccos_api/sccos.api';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      loginApi(): Chainable<void>;
      goToCheckout(): Chainable<void>;
      goToCheckoutAsGuest(): Chainable<void>;
      goToCart(): Chainable<void>;
      goToCartAsGuest(): Chainable<void>;
      hydrateElemenet(assetPath: string, triggerHydrationFn): Chainable<void>;
      customerCartsCleanup(sccosApi: SCCOSApi, user: TestCustomerData): void;
      customerAddressesCleanup(
        sccosApi: SCCOSApi,
        user: TestCustomerData
      ): void;
      checkCurrencyFormatting(locale: string): void;
      failApiCall(routeMatcherOptions: RouteMatcherOptions, actionFn): void;
      checkGlobalNotificationAfterFailedApiCall(page: AbstractSFPage): void;
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.fixture<TestCustomerData>('test-customer').then((customer) => {
    const loginPage = new LoginPage();

    loginPage.visit();

    cy.intercept('/customers/DE--**').as('profileRequest');
    loginPage.loginForm.login(customer);
    cy.wait('@profileRequest');

    loginPage.header.getUserSummaryHeading().should('contain', customer.name);
  });
});

Cypress.Commands.add('loginApi', () => {
  cy.fixture<TestCustomerData>('test-customer').then((customer) => {
    const api = new SCCOSApi();

    api.token.post(customer).then((res) => {
      cy.window().then((win) => {
        win.localStorage.setItem(
          'oryx.oauth-state',
          '{"authorizedBy":"spryker"}'
        );
        win.localStorage.setItem('oryx.oauth-token', JSON.stringify(res.body));
      });
    });
  });
});

Cypress.Commands.add('goToCart', () => {
  const cartPage = new CartPage();

  cy.intercept('/customers/DE--**/carts?**').as('cartsRequest');
  cartPage.visit();
  cy.wait('@cartsRequest');
});

Cypress.Commands.add('goToCheckout', () => {
  const cartPage = new CartPage();

  cy.goToCart();

  // carts request is not enought to be sure
  // that checkout button is clickable
  // we have to wait for other elements, and even with them
  // there is no 100% guarranty that checkout btn is ready
  cartPage.getCartTotals().getTotalPrice().should('be.visible');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(250);

  cy.intercept({
    method: 'GET',
    url: '/customers/*/addresses',
  }).as('addressesRequest');
  cartPage.checkout();
  cy.wait('@addressesRequest');
});

Cypress.Commands.add('goToCartAsGuest', () => {
  const cartPage = new CartPage();

  cy.intercept('/guest-carts?**').as('cartsRequest');
  cartPage.visit();
  cy.wait('@cartsRequest');
});

Cypress.Commands.add('goToCheckoutAsGuest', () => {
  const cartPage = new CartPage();

  cy.goToCartAsGuest();

  // carts request is not enought to be sure
  // that checkout button is clickable
  // we have to wait for other elements, and even with them
  // there is no 100% guarranty that checkout btn is ready
  cartPage.getCartTotals().getTotalPrice().should('be.visible');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(250);

  cy.intercept('/assets/addresses/*.json').as('addressesRequest');
  cartPage.checkout();
  cy.wait('@addressesRequest');
});

// this action is temporarily changed
// because of constant hydation issues and instability
//
// All tests, including regression, will be run against SPA build
// till SSR is not fixed completely
//
// still, smoke tests should run against SSR build
Cypress.Commands.add(
  'hydrateElemenet',
  (assetPath: string, triggerHydrationFn) => {
    if (Cypress.env('isSSR')) {
      cy.intercept(assetPath).as(`${assetPath}Request`);

      triggerHydrationFn();

      cy.wait(`@${assetPath}Request`);

      // wait till hydrated elements are re-rendered
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
    }
  }
);

Cypress.Commands.add(
  'customerCartsCleanup',
  (sccosApi: SCCOSApi, user: TestCustomerData) => {
    sccosApi.carts.customersGet(user.id).then((response) => {
      const carts = response.body.data;

      // remove last cart id from the list
      // because it can't be deleted
      carts.pop();

      carts.map((cart) => cart.id).forEach((id) => sccosApi.carts.delete(id));
    });

    // create new, empty cart
    sccosApi.carts.post();
  }
);

Cypress.Commands.add(
  'customerAddressesCleanup',
  (sccosApi: SCCOSApi, user: TestCustomerData) => {
    sccosApi.addresses.get(user.id).then((response) => {
      const addresses = response.body.data;

      addresses
        .map((address) => address.id)
        .forEach((id) => sccosApi.addresses.delete(user.id, id));
    });
  }
);

const failApiCallResponse = {
  statusCode: 500,
  body: 'Internal Server Error',
  forceError: false,
};
const apiErrorMessage = `${failApiCallResponse.statusCode} ${failApiCallResponse.body}`;

Cypress.Commands.add('failApiCall', (options, actionFn) => {
  // prevents test from failing
  // if unhandled 500 error occurs
  Cypress.on('uncaught:exception', (err) => {
    return !err.message.includes(apiErrorMessage);
  });

  cy.intercept(options, failApiCallResponse).as('failedRequest');
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
      notifications[0].getSubtext().should('have.text', apiErrorMessage);

      // close notification
      notifications[0].getCloseBtn().click();

      // check if notification disappeared
      notifications[0].getWrapper().should('not.exist');
      page.globalNotificationCenter.getWrapper().should('not.be.visible');
    });
  }
);

Cypress.Commands.add(
  'checkCurrencyFormatting',
  { prevSubject: true },
  (subject, locale: string) => {
    switch (locale) {
      case 'en':
        return cy
          .wrap(subject)
          .invoke('text')
          .then((price) => {
            const currencySymbolPosition = price.indexOf('€');
            expect(currencySymbolPosition).to.eq(0);
          });
      case 'de':
        return cy
          .wrap(subject)
          .invoke('text')
          .then((price) => {
            const currencySymbolPosition = price.indexOf('€');
            expect(currencySymbolPosition).to.eq(price.length - 1);
          });
      default:
        throw new Error(`locale "${locale}" is not supported`);
    }
  }
);
