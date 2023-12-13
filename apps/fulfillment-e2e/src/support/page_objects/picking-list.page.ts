import { AFAPage } from './abstract-fa.page';
import { WarehouseSelectionPage } from './warehouse-selection.page';

export class PickingListPage extends AFAPage {
  url = '/';

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

  getPickingListItems = () => cy.get('oryx-picking-list-item');

  startPickingByEq = (eq = 0) => {
    this.getPickingListItems().eq(eq).find('.start-picking').click();
  };
}
