import { CustomerNoteFragment } from '../support/page_fragments/customer-note.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();
const customerNoteFragment = new CustomerNoteFragment();

describe('pick a picking list in progress', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    cy.mockPickingInProgress();

    // open first picking which is mocked as In Progress
    pickingListsFragment.getStartPickingButtons().eq(0).click();
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

    pickingListsFragment.pickingInProgressModal.getModal().should('be.visible');
  });

  describe('and picking in progress modal is closed', () => {
    beforeEach(() => {
      pickingListsFragment.pickingInProgressModal.getCloseButton().click();
    });

    it('should hide modal and navigate back to the picking list', () => {
      pickingListsFragment.pickingInProgressModal
        .getModal()
        .should('not.be.visible');

      cy.location('pathname').should('be.equal', '/');
      pickingListsFragment.getPickingListsItems().should('be.visible');
    });
  });
});
