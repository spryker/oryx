import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { PickingListsHeaderFragment } from '../support/page_fragments/picking-lists-header.fragment';

const pickingListsFragment = new PickingListsFragment();
const headerFragment = new PickingListsHeaderFragment();

describe('Picking Lists', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
  });

  it('should display picking lists', () => {
    headerFragment.getSearchIcon().should('be.visible');
    headerFragment.getUserIcon().should('be.visible');
    headerFragment.getHeadline().should('contain.text', 'Pick lists');
    pickingListsFragment.getSortButton().should('be.visible');

    pickingListsFragment.getWrapper().should('be.visible');
    pickingListsFragment.getPickingListsItems().should('be.visible');
  });
});
