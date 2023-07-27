import { CustomerNoteModalFragment } from '../support/page_fragments/customer-note-modal.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();
const customerNoteFragment = new CustomerNoteModalFragment();

describe('when the user opens the page', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
  });

  describe('and the user opens customer note', () => {
    beforeEach(() => {
      pickingListsFragment.getCustomerNoteButtons().click();
    });

    it('should show the customer note modal', () => {
      customerNoteFragment.getModal().should('be.visible');
    });

    describe('and when the user clicks on close button', () => {
      beforeEach(() => {
        customerNoteFragment.getCloseButton().click();
      });

      it('should close customer note modal', () => {
        customerNoteFragment.getModal().should('not.be.visible');
      });
    });
  });
});
