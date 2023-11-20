import { ListsHeaderFragment } from '../support/page_fragments/lists-header.fragment';
import { ListsFragment } from '../support/page_fragments/lists.fragment';
import { UserProfileFragment } from '../support/page_fragments/user-profile-modal.fragment';

const listsFragment = new ListsFragment();
const headerFragment = new ListsHeaderFragment();
const userProfileFragment = new UserProfileFragment();

describe('Picking Lists Search', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    headerFragment.getSearch().click();
  });

  it('should show correct picking items after search', () => {
    listsFragment.getWrapper().should('be.visible');
    headerFragment
      .getSearchInput()
      .should('be.visible')
      .should('have.attr', 'placeholder');

    listsFragment.getNoItemsFallbackHeading().should('be.visible');
    listsFragment.getStartSearchingFallbackImage().should('be.visible');

    headerFragment.getSearchInput().type('D', { force: true });
    listsFragment.getNoItemsFallbackHeading().should('be.visible');
    listsFragment.getStartSearchingFallbackImage().should('be.visible');

    headerFragment.getSearchInput().type('E', { force: true });
    listsFragment.getPickingListsItems().should('have.length.at.least', 1);

    headerFragment.getSearchClearButton().click();
    listsFragment.getNoItemsFallbackHeading().should('be.visible');
    listsFragment.getStartSearchingFallbackImage().should('be.visible');

    headerFragment.getSearchInput().type('something', { force: true });
    listsFragment.getNoItemsFallbackHeading().should('be.visible');
    listsFragment.getNoPickingResultsFallbackImage().should('be.visible');

    headerFragment.getSearchBackButton().click();
    listsFragment.getNoItemsFallback().should('not.exist');
    headerFragment.getTitle().should('be.visible');
    listsFragment.getPickingListsItems().should('have.length.at.least', 1);

    headerFragment.getUserIcon().should('be.visible').click();

    userProfileFragment.getWrapper().should('be.visible');
  });
});
