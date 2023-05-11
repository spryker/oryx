import { CustomerNoteModalFragment } from '../support/page_fragments/customer-note-modal.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();
const customerNoteFragment = new CustomerNoteModalFragment();

describe('When the user opens customer note', () => {
  beforeEach(() => {
    cy.login();
    pickingListsFragment.getCustomerNoteButtons().eq(0).click();
  });

  describe('and user clicks on close button', () => {
    beforeEach(() => {
      customerNoteFragment.getModal().should('be.visible');
      customerNoteFragment.getCloseButton().click();
    });

    it('should close customer note modal', () => {
      customerNoteFragment.getModal().should('not.be.visible');
    });
  });
});
