import { CustomerNoteFragment } from '../support/page_fragments/customer-note.fragment';
import { ListsFragment } from '../support/page_fragments/lists.fragment';

const listsFragment = new ListsFragment();
const customerNoteFragment = new CustomerNoteFragment();

describe('pick a picking list in progress', () => {
  beforeEach(() => {
    cy.login();
    cy.mockPickingInProgress();

    // open first picking which is mocked as In Progress
    listsFragment.getStartPickingButtons().eq(0).click();
    // safe the url
    cy.location('pathname').as('openedPickingUrl');
    // wait for event handlers initialization
    // we can't remove this wait in current implementation because we can't detect
    // if handler was set successfully
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    // open Picking in progress modal
    customerNoteFragment.getProceedToPickingButton().click();
  });

  it('should stay on the same page and show modal', () => {
    cy.get('@openedPickingUrl').then((url) => {
      cy.location('pathname').should('be.equal', url);
    });

    listsFragment.pickingInProgressModal.getModal().should('be.visible');
  });

  describe('and picking in progress modal is closed', () => {
    beforeEach(() => {
      listsFragment.pickingInProgressModal.getCloseButton().click();
    });

    it('should hide modal and navigate back to the picking list', () => {
      listsFragment.pickingInProgressModal.getModal().should('not.be.visible');

      cy.location('pathname').should('be.equal', '/');
      listsFragment.getPickingListsItems().should('be.visible');
    });
  });
});
