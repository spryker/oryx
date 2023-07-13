import { TestUserData } from '../types/user.type';
import { LoginPage } from './page_objects/login.page';
import { WarehouseSelectionListFragment } from './page_fragments/warehouse-selection-list.fragment';
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(user?: TestUserData): Chainable<void>;
      clearIndexedDB(): void;
      waitForIndexedDB(): void;
      mockPickingInProgress(): void;
      mockSyncPending(): void;
    }
  }
}

const indexedDBName = 'fulfillment-app-db';
const indexedDBStorageName = 'oryx-local-db-storage';
const defaultUser = { email: 'admin@spryker.com', password: 'change123' };
const loginPage = new LoginPage();

Cypress.Commands.add('login', (user = defaultUser) => {
  const warehouseSelectionListFragment = new WarehouseSelectionListFragment();

  cy.intercept('POST', '**/token').as('token');

  loginPage.visit();
  loginPage.loginForm.login(user);

  // we have to wait for 5++ seconds here
  // because our bundle is huge and Cypress is not able
  // to cache all 500++ files fast enough
  cy.wait('@token', { timeout: 30000 });

  cy.intercept('GET', '**/warehouse-user-assignments').as(
    'warehouse-user-assignments'
  );
  cy.wait('@warehouse-user-assignments');
  warehouseSelectionListFragment.getWarehouseSelectionButtons().eq(0).click();

  cy.intercept('GET', '**/picking-lists?include*').as('picking-lists');
  cy.wait('@picking-lists');

  cy.waitForIndexedDB();
  // this wait is needed to populate the DB with data
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(800);
});

Cypress.Commands.add('clearIndexedDB', () => {
  new Cypress.Promise((resolve, reject) => {
    cy.window().then(async (win) => {
      try {
        await Promise.all([
          clearIndexedDb(win, indexedDBName),
          clearIndexedDb(win, indexedDBStorageName),
        ]);
        resolve();
      } catch {
        reject();
      }
    });
  });
});

Cypress.Commands.add('waitForIndexedDB', () => {
  cy.log('Wait for IndexedDB existance...');

  const checkIndexedDBExistence = () => {
    return new Cypress.Promise(async (resolve, reject) => {
      try {
        await Promise.all([
          indexedDbExists(indexedDBName),
          indexedDbExists(indexedDBStorageName),
        ]);
        resolve();
      } catch {
        reject();
      }
    });
  };

  return cy.wrap(null).then(() => {
    const checkInterval = 200;
    const maxAttempts = 30;
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

Cypress.Commands.add('mockSyncPending', () => {
  new Cypress.Promise((resolve, reject) => {
    cy.window().then(async (win) => {
      try {
        await mockSyncPending(win);
        resolve();
      } catch {
        reject();
      }
    });
  });
});

Cypress.Commands.add('mockPickingInProgress', () => {
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

async function indexedDbExists(dbName) {
  const dbs = await indexedDB.databases();
  if (!dbs.map((db) => db.name).includes(dbName)) {
    throw `DB "${dbName}" not found`;
  }

  console.log(`DB "${dbName}" exists`);
}

function clearIndexedDb(win, dbName) {
  return new Promise<void>((resolve, reject) => {
    const deleteRequest = win.indexedDB.deleteDatabase(dbName);

    deleteRequest.onsuccess = function () {
      console.log(`"${dbName}" database deleted successfully`);
      resolve();
    };

    deleteRequest.onerror = function () {
      console.log(`Couldn't delete database "${dbName}"`);
      reject();
    };

    deleteRequest.onblocked = function () {
      console.warn(
        `Couldn't delete database "${dbName}" due to the operation being blocked`
      );
      reject();
    };
  });
}

function mockSyncPending(win) {
  return new Promise<void>((resolve, reject) => {
    const request = win.indexedDB.open('fulfillment-app-db');

    request.onsuccess = function () {
      const db = request.result;

      const store = db
        .transaction('oryx.syncs', 'readwrite')
        .objectStore('oryx.syncs');

      const transaction = store.add({ status: 'processing' });

      transaction.onsuccess = function () {
        console.log('pending sync added');
        resolve();
      };

      transaction.onerror = function () {
        console.log('could not add pending sync');
        reject();
      };
    };

    request.onerror = function () {
      console.log('could not access database');
      reject();
    };
  });
}
