import { LoginPage } from './page-objects/login.page';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      backofficeLogin(email?: string, password?: string): void;
      backofficeMakeOrderReadyForPicking(orderId: string): Chainable<string>;
    }
  }
}

Cypress.Commands.add(
  'backofficeLogin',
  (email = 'admin@spryker.com', password = 'change123') => {
    const loginPage = new LoginPage();

    loginPage.visit();
    loginPage.login(email, password);
  }
);

Cypress.Commands.add(
  'backofficeMakeOrderReadyForPicking',
  (orderId: string) => {
    cy.origin(Cypress.env('backofficeUrl'), () => {
      // enables cypress actions usage inside origin calls
      Cypress.require(__dirname + '/commands');

      cy.backofficeLogin();
    });

    // back to FA
    cy.visit('/');

    return cy.wrap(orderId);
  }
);
