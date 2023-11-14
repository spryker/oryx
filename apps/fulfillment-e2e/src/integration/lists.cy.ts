import { ListsHeaderFragment } from '../support/page_fragments/lists-header.fragment';
import { ListsFragment } from '../support/page_fragments/lists.fragment';

const listsFragment = new ListsFragment();
const headerFragment = new ListsHeaderFragment();

describe('Picking Lists', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.createPicking().then((orderId) => {
      cy.login();
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
