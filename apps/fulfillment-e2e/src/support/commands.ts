import { TestUserData } from '../types/user.type';
import { LoginPage } from './page_objects/login.page';
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(user?: TestUserData): Chainable<void>;
      clearIndexedDB(): void;
      waitForIndexedDB(): void;
      pickingInProgress(): void;
    }
  }
}

const indexedDBName = 'fulfillment-app-db';
const defaultUser = { email: 'admin@spryker.com', password: 'change123' };
const loginPage = new LoginPage();

Cypress.Commands.add('login', (user = defaultUser) => {
  cy.intercept('POST', '**/token').as('token');

  loginPage.visit();
  loginPage.loginForm.login(user);

  cy.wait('@token');

  cy.intercept('GET', '**/picking-lists?include*').as('picking-lists');
  cy.wait('@picking-lists');

  cy.waitForIndexedDB();
  // this wait is needed to populate the DB with data
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
});

Cypress.Commands.add('clearIndexedDB', () => {
  new Cypress.Promise((resolve, reject) => {
    cy.window().then((win) => {
      const deleteRequest = win.indexedDB.deleteDatabase(indexedDBName);

      deleteRequest.onsuccess = function () {
        console.log('Deleted database successfully');
        resolve();
      };

      deleteRequest.onerror = function () {
        console.warn("Couldn't delete database");
        reject();
      };

      deleteRequest.onblocked = function () {
        console.warn(
          "Couldn't delete database due to the operation being blocked"
        );
        reject();
      };
    });
  });
});

Cypress.Commands.add('waitForIndexedDB', () => {
  cy.log('Wait for IndexedDB existance...');

  const checkIndexedDBExistence = () => {
    return new Cypress.Promise((resolve, reject) => {
      indexedDB.databases().then((dbs) => {
        if (dbs.map((db) => db.name).includes(indexedDBName)) {
          resolve('DB found');
        }

        reject();
      });
    });
  };

  return cy.wrap(null).then(() => {
    const checkInterval = 100;
    const maxAttempts = 60;
    let attempts = 0;

    const checkExistenceLoop = () => {
      return checkIndexedDBExistence().catch((error) => {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        } else {
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(checkInterval).then(checkExistenceLoop);
        }
      });
    };

    return checkExistenceLoop();
  });
});

Cypress.Commands.add('pickingInProgress', () => {
  cy.intercept('PATCH', '**/picking-lists/*', {
    statusCode: 409,
    body: {
      errors: [
        {
          message: 'Picklist is already being picked by another user.',
          status: 409,
          code: '5310',
        },
      ],
    },
  });
});
