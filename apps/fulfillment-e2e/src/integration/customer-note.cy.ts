import { CustomerNoteFragment } from '../support/page_fragments/customer-note.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();
const customerNoteFragment = new CustomerNoteFragment();

describe('Customer note', () => {
  beforeEach(() => {
    cy.visit('/');
    pickingListsFragment.getCustomerNoteButton().click();
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
