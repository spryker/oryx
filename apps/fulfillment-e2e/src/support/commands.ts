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

const defaultUser = { email: 'admin@spryker.com', password: 'change123' };
const loginPage = new LoginPage();

Cypress.Commands.add('login', (user = defaultUser) => {
  cy.intercept('POST', '**/token').as('token');

  loginPage.visit();
  loginPage.loginForm.login(user);

  cy.wait('@token');

  cy.intercept('GET', '**/picking-lists?*', (req) => {
    req.on('response', (res) => {
      res.setDelay(1000);
    });
  }).as('picking-lists');
  cy.wait('@picking-lists');
});

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
