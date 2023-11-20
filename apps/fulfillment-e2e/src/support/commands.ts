import { Interception } from 'node_modules/cypress/types/net-stubbing';
import { TestUserData } from '../types/user.type';
import { PickingApi } from './backoffice-api/picking.api';
import './backoffice/commands';
import { CheckoutApi } from './glue-api/checkout.api';
import { GuestCartsItemsApi } from './glue-api/guest-carts-items.api';
import { GuestCartsApi } from './glue-api/guest-carts.api';
import { ListsHeaderFragment } from './page_fragments/lists-header.fragment';
import { ListsFragment } from './page_fragments/lists.fragment';
import { UserProfileFragment } from './page_fragments/user-profile-modal.fragment';
import { LoginPage } from './page_objects/login.page';
import { PickListsPage } from './page_objects/pick-lists.page';
import { WarehouseSelectionPage } from './page_objects/warehouse-selection.page';
export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(user?: TestUserData): void;
      clearIndexedDB(): void;
      waitForIndexedDB(): void;
      mockPickingInProgress(): void;
      mockSyncPending(): void;
      receiveData(): Chainable<any>;
      createPicking(): Chainable<string>;
      cleanupPickings(): void;
      glueApiCreateOrder(): Chainable<string>;
      waitForPickingToAppear(orderId: string): Chainable<string>;
    }
  }
}

const indexedDBName = 'fulfillment-app-db';
const indexedDBStorageName = 'oryx-local-db-storage';
export const defaultUser = {
  email: 'harald@spryker.com',
  password: 'change123',
  warehouseName: 'Spryker MER000001 Warehouse 1',
};

Cypress.Commands.add('login', (user = defaultUser) => {
  const loginPage = new LoginPage();
  const warehouseSelectionPage = new WarehouseSelectionPage();
  const pickListsPage = new PickListsPage();

  loginPage.visit();
  loginPage.login(user);
  warehouseSelectionPage.waitForLoaded();
  warehouseSelectionPage.selectByName(user.warehouseName);
  pickListsPage.waitForLoaded();
});

Cypress.Commands.add('createPicking', () => {
  // initializes FA as a base domain
  cy.visit('/');

  return cy
    .glueApiCreateOrder()
    .then((orderId) => cy.backofficeMakeOrderReadyForPicking(orderId));
});

Cypress.Commands.add('cleanupPickings', () => {
  const api = new PickingApi();

  // picking list requests should already be intercepted and available in this place
  cy.get<Interception>('@picking-lists').then((interception: Interception) => {
    api.accessToken = interception.request.headers.authorization as string;

    interception.response.body.data
      .filter((picking) => picking.attributes.status === 'ready-for-picking')
      .map((picking) => picking.id)
      .map((pickingId) => api.startPicking(pickingId));
  });
});

Cypress.Commands.add('receiveData', () => {
  const header = new ListsHeaderFragment();
  const profile = new UserProfileFragment();

  header.getUserIcon().click();
  profile.getReceiveDataButton().click();

  return cy.wrap(null);
});

Cypress.Commands.add('glueApiCreateOrder', () => {
  const customerUniqueId = Math.random();
  const guestCartsApi = new GuestCartsApi();
  const guestCartsItemsApi = new GuestCartsItemsApi();
  const checkoutApi = new CheckoutApi();

  guestCartsApi.customerUniqueId = customerUniqueId;
  guestCartsItemsApi.customerUniqueId = customerUniqueId;
  checkoutApi.customerUniqueId = customerUniqueId;

  return (
    guestCartsItemsApi
      // add product that is always available in the stock
      // 086_30521602 adjusted manually in backoffice, we have to
      // find another product to use here later
      .postGuestCartsItems('086_30521602', 1)
      .then(() => guestCartsApi.getGuestCarts())
      .then((res) => res.body.data[0].id)
      .then((idCart) => checkoutApi.checkout(idCart))
      .then((res) => res.body.data.attributes.orderReference)
  );
});

Cypress.Commands.add('waitForPickingToAppear', (orderId: string) => {
  const list = new ListsFragment();

  list.getPickingListsItems().should('have.length', 1);
  list.getPickingListItemByOrderId(orderId).should('be.visible');

  return cy.wrap(orderId);
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
  cy.intercept('POST', /.+\/picking-lists\/.+\/start-picking$/, {
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
