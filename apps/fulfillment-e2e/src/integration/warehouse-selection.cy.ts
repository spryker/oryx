import { PickingListPage } from '../support/page_objects/picking-list.page';
import { WarehouseSelectionPage } from '../support/page_objects/warehouse-selection.page';

let whSelectionPage: WarehouseSelectionPage;

describe('Warehouse selection suite', () => {
  beforeEach(() => {
    whSelectionPage = new WarehouseSelectionPage();

    cy.clearIndexedDB();
    cy.login();
    whSelectionPage.visit();
  });

  it('should navigate to picking lists after warehouse selection', () => {
    verifyWarehouseListVisibility();

    const pickListsPage = new PickingListPage();

    whSelectionPage.selectByEq(0);
    pickListsPage.waitForLoaded();
  });
});

function verifyWarehouseListVisibility() {
  whSelectionPage.getWrapper().should('be.visible');
  whSelectionPage.getNames().should('have.length.gt', 0);
  whSelectionPage.getSelectBtns().should('have.length.gt', 0);
}
