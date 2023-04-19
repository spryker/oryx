export {};

declare global {
  namespace Cypress {
    interface Chainable {
      clearIndexedDB(): void;
      findByTestId(selector: string): Chainable<JQuery<HTMLElement>>;
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

Cypress.Commands.add(
  'findByTestId',
  { prevSubject: 'element' },
  (subject, selector, ...args) => {
    return cy.wrap(subject).find(`[data-testid=${selector}]`, ...args);
  }
);
