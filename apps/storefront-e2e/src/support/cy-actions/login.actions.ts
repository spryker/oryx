import { LoginPage } from '../page-objects/login.page';
import { SCCOSApi } from '../sccos-api/sccos.api';
import { Customer } from '../types/user.type';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      loginApi(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.fixture<Customer>('test-customer').then((customer) => {
    const loginPage = new LoginPage();

    loginPage.visit();

    cy.intercept('/customers/DE--**').as('profileRequest');
    loginPage.loginForm.login(customer);
    cy.wait('@profileRequest');

    loginPage.header.getUserSummaryHeading().should('contain', customer.name);
  });
});

Cypress.Commands.add('loginApi', () => {
  cy.fixture<Customer>('test-customer').then((customer) => {
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
