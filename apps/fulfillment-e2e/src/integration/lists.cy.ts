import { ListsFragment } from '../support/page_fragments/lists.fragment';
import { ListsHeaderFragment } from '../support/page_fragments/lists-header.fragment';

const listsFragment = new ListsFragment();
const headerFragment = new ListsHeaderFragment();

describe('Picking Lists', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
  });

  it('should display picking lists', () => {
    headerFragment.getSearchIcon().should('be.visible');
    headerFragment.getUserIcon().should('be.visible');
    headerFragment.getHeadline().should('contain.text', 'Pick lists');
    listsFragment.getSortButton().should('be.visible');

    listsFragment.getWrapper().should('be.visible');
    listsFragment.getPickingListsItems().should('be.visible');
  });
});
