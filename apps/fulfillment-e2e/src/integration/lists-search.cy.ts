import { ListsHeaderFragment } from '../support/page_fragments/lists-header.fragment';
import { ListsFragment } from '../support/page_fragments/lists.fragment';
import { UserProfileFragment } from '../support/page_fragments/user-profile-modal.fragment';

const listsFragment = new ListsFragment();
const headerFragment = new ListsHeaderFragment();
const userProfileFragment = new UserProfileFragment();

// TODO: this is component test, not E2E
describe('Picking Lists Search', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    cy.cleanupPickings();
    cy.createPicking().then((orderId) => {
      cy.receiveData();
      cy.waitForPickingToAppear(orderId);
    });

    headerFragment.openSearch();
  });

  it('should show correct picking items after search', () => {
    verifyDefaultState();
    verifyStateAfterInput();
    vefiryStateAfterCleanup();
    vefifyInvalidSearch();
    verifySearchBackButton();
    vefityUserProfileButton();
  });
});

function verifyDefaultState() {
  listsFragment.getWrapper().should('be.visible');
  headerFragment.getSearchInput().should('be.visible');
  listsFragment.getNoItemsFallbackHeading().should('be.visible');
  listsFragment.getStartSearchingFallbackImage().should('be.visible');
}

function verifyStateAfterInput() {
  // first letter -> no search performed
  headerFragment.getSearchInput().type('D', { force: true });
  listsFragment.getNoItemsFallbackHeading().should('be.visible');
  listsFragment.getStartSearchingFallbackImage().should('be.visible');

  // second letter -> searching...
  headerFragment.getSearchInput().type('E', { force: true });
  listsFragment.getPickingListsItems().should('have.length.at.least', 1);
}

function vefiryStateAfterCleanup() {
  headerFragment.getSearchClearButton().click();
  listsFragment.getNoItemsFallbackHeading().should('be.visible');
  listsFragment.getStartSearchingFallbackImage().should('be.visible');
}

function vefifyInvalidSearch() {
  headerFragment.getSearchInput().type('something', { force: true });
  listsFragment.getNoItemsFallbackHeading().should('be.visible');
  listsFragment.getNoPickingResultsFallbackImage().should('be.visible');
}

function verifySearchBackButton() {
  headerFragment.getSearchBackButton().click();
  listsFragment.getNoItemsFallback().should('not.exist');
  headerFragment.getTitle().should('be.visible');
  listsFragment.getPickingListsItems().should('have.length.at.least', 1);
}

function vefityUserProfileButton() {
  headerFragment.getUserIcon().should('be.visible').click();
  userProfileFragment.getWrapper().should('be.visible');
}
