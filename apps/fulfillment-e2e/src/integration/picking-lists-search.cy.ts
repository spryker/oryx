import { PickingListsHeaderFragment } from '../support/page_fragments/picking-lists-header.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { UserProfileFragment } from '../support/page_fragments/user-profile-modal.fragment';

const pickingListsFragment = new PickingListsFragment();
const headerFragment = new PickingListsHeaderFragment();
const userProfileFragment = new UserProfileFragment();

describe('Picking Lists Search', { tags: 'smoke' }, () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    headerFragment.getSearch().click();
  });

  it('should show correct picking items after search', () => {
    pickingListsFragment.getWrapper().should('be.visible');
    headerFragment
      .getSearchInput()
      .should('be.visible')
      .should('have.attr', 'placeholder');

    pickingListsFragment.getNoItemsFallbackHeading().should('be.visible');
    pickingListsFragment.getStartSearchingFallbackImage().should('be.visible');

    headerFragment.getSearchInput().type('D', { force: true });
    pickingListsFragment.getNoItemsFallbackHeading().should('be.visible');
    pickingListsFragment.getStartSearchingFallbackImage().should('be.visible');

    headerFragment.getSearchInput().type('E', { force: true });
    pickingListsFragment
      .getPickingListsItems()
      .should('have.length.at.least', 1);

    headerFragment.getSearchClearButton().click();
    pickingListsFragment.getNoItemsFallbackHeading().should('be.visible');
    pickingListsFragment.getStartSearchingFallbackImage().should('be.visible');

    headerFragment.getSearchInput().type('something', { force: true });
    pickingListsFragment.getNoItemsFallbackHeading().should('be.visible');
    pickingListsFragment
      .getNoPickingResultsFallbackImage()
      .should('be.visible');

    headerFragment.getSearchBackButton().click();
    pickingListsFragment.getNoItemsFallback().should('not.exist');
    headerFragment.getTitle().should('be.visible');
    pickingListsFragment
      .getPickingListsItems()
      .should('have.length.at.least', 1);

    headerFragment.getUserIcon().should('be.visible').click();

    userProfileFragment.getWrapper().should('be.visible');
  });
});
