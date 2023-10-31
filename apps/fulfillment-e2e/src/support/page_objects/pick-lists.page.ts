import { AbstractFAPage } from './abstract.page';
import { WarehouseSelectionPage } from './warehouse-selection.page';

export class PickListsPage extends AbstractFAPage {
  url = '';

  constructor() {
    super();
    cy.intercept('GET', '**/picking-lists?include*').as('picking-lists');
  }

  warehousesList = new WarehouseSelectionPage();

  waitForLoaded = () => {
    cy.wait('@picking-lists');
    cy.waitForIndexedDB();
    // this wait is needed to populate the DB with data
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(800);
  };
}
