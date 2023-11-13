import 'cypress-wait-until';
import { LoginPage } from './page-objects/login.page';
import { OrderPage } from './page-objects/order.page';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      backofficeLogin(email?: string, password?: string): void;
      backofficeMakeOrderReadyForPicking(orderId: string): Chainable<string>;
      backofficeMoveOrderInReadyForPicking(orderId: string): void;
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
    cy.origin(
      Cypress.env('backofficeUrl'),
      { args: { orderId } },
      ({ orderId }) => {
        // enables cypress actions usage inside origin calls
        Cypress.require(__dirname + '/commands');
        // ignore all zed UI JS errors
        Cypress.on('uncaught:exception', () => false);

        cy.backofficeLogin();
        cy.backofficeMoveOrderInReadyForPicking(orderId);
      }
    );

    // back to FA
    cy.visit('/');

    return cy.wrap(orderId);
  }
);

Cypress.Commands.add(
  'backofficeMoveOrderInReadyForPicking',
  (orderId: string) => {
    const orderPage = new OrderPage(orderId);

    orderPage.visit();

    cy.waitUntil(
      () => {
        return cy
          .reload()
          .then(() => Cypress.$('[action*="?event=pay"]').length);
      },
      { timeout: 120000, interval: 5000 }
    );

    orderPage.payForOrder();
    orderPage.skipTimeout();
    orderPage.pickingListGenerationSchedule();
    orderPage.prepareForPicking();
  }
);
