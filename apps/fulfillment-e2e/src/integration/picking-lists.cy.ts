import { HeaderFragment } from '../support/page_fragments/lists-header.fragment';
import { ListsFragment } from '../support/page_fragments/lists.fragment';

const listsFragment = new ListsFragment();
const headerFragment = new HeaderFragment();

describe('Picking Lists', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    cy.cleanupPickings();
    cy.createPicking().then((orderId) => {
      cy.receiveData();
      cy.waitForPickingToAppear(orderId);
    });
  });

  it('should display picking lists', () => {
    headerFragment.getSearchIcon().should('be.visible');
    headerFragment.getUserIcon().should('be.visible');

    listsFragment.getSortButton().should('be.visible');
    listsFragment.getWrapper().should('be.visible');

    listsFragment.getPickingListsItems().should('be.visible');
  });
});
