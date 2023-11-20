import { PickListsPage } from '../support/page_objects/pick-lists.page';
import { WarehouseSelectionPage } from '../support/page_objects/warehouse-selection.page';

let whSelectionPage: WarehouseSelectionPage;

describe('Warehouse selection', () => {
  beforeEach(() => {
    // TODO: ???
    whSelectionPage = new WarehouseSelectionPage();

    cy.clearIndexedDB();
    cy.login();
    whSelectionPage.visit();
  });

  it('should render available warehouses', () => {
    whSelectionPage.getWrapper().should('be.visible');
    whSelectionPage.getNames().should('have.length.gt', 0);
    whSelectionPage.getSelectBtns().should('have.length.gt', 0);
  });

  it('should navigate to picking lists after warehouse selection', () => {
    const pickListsPage = new PickListsPage();

    whSelectionPage.selectByEq(0);
    pickListsPage.waitForLoaded();
  });
});
