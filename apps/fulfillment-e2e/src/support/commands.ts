export {};

declare global {
  namespace Cypress {
    interface Chainable {
      clearIndexedDB(): void;
    }
  }
}

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
