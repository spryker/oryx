import { GlueAPI } from '../apis/glue.api';
import { LoginPage } from '../page-objects/login.page';
import { Customer } from '../types/user.type';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      loginApi(api: GlueAPI): Chainable<void>;
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
  });
});

Cypress.Commands.add('loginApi', (api: GlueAPI) => {
  cy.fixture<Customer>('test-customer').then((customer) => {
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
