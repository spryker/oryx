import { PickingListPage } from '../support/page_objects/picking-list.page';
import { WarehouseSelectionPage } from '../support/page_objects/warehouse-selection.page';

let whSelectionPage: WarehouseSelectionPage;

// TODO: this is not E2E, these are component tests
xdescribe('Warehouse selection suite', () => {
  beforeEach(() => {
    whSelectionPage = new WarehouseSelectionPage();

    cy.clearIndexedDB();
    cy.login();
    whSelectionPage.visit();
  });

  // this check is covered already in Auth flows, we don't need to have it in E2Es
  // but we can have it in component tests
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
