import { WarehouseSelectionPage } from '../support/page_objects/warehouse-selection.page';
import { WarehouseSelectionListFragment } from '../support/page_fragments/warehouse-selection-list.fragment';
import { HeaderFragment } from '../support/page_fragments/header.fragment';
import { UserProfileFragment } from '../support/page_fragments/user-profile-modal.fragment';

const warehouseSelectionPage = new WarehouseSelectionPage();
const warehouseSelectionListFragment = new WarehouseSelectionListFragment();
const headerFragment = new HeaderFragment();
const userProfileFragment = new UserProfileFragment();

describe('Warehouse selection', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    warehouseSelectionPage.visit();
  });

  it('should check warehouses selection page', () => {
    headerFragment.getWrapper().should('be.visible');
    headerFragment.getUserIcon().should('be.visible');
    headerFragment.getUserIcon().click();

    userProfileFragment.getWrapper().should('be.visible');
    userProfileFragment.getLogOutButton().should('be.visible');
    userProfileFragment.getWrapper().should('be.visible');
    userProfileFragment.getCloseButton().should('be.visible');
    userProfileFragment.getCloseButton().click();

    warehouseSelectionListFragment.getWrapper().should('be.visible');
    warehouseSelectionListFragment
      .getTitle()
      .should('contain.text', 'Select your location to get started');
    warehouseSelectionListFragment.getWarehouseNames().should('have.length', 3);
    warehouseSelectionListFragment
      .getWarehouseSelectionButtons()
      .should('have.length', 3);
  });
});
