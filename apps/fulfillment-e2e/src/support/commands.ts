import { TestUserData } from '../types/user.type';
import { LoginPage } from './page_objects/login.page';
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(user?: TestUserData): Chainable<void>;
      clearIndexedDB(): void;
    }
  }
}

const loginPage = new LoginPage();

Cypress.Commands.add(
  'login',
  (user = { email: 'admin@spryker.com', password: 'change123' }) => {
    cy.intercept('GET', '**/picking-lists/*').as('picking-lists');

    loginPage.visit();
    loginPage.loginForm.login(user);

    cy.wait('@picking-lists');
  }
);

Cypress.Commands.add('clearIndexedDB', () => {
  cy.window().then((win) => {
    const databases = win.indexedDB.databases();
    databases.then((dbs) => {
      dbs.forEach((db) => {
        win.indexedDB.deleteDatabase(db.name);
      });
    });
  });
});
