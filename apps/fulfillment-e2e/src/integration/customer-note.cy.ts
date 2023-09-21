import { CustomerNoteModalFragment } from '../support/page_fragments/customer-note-modal.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();
const customerNoteFragment = new CustomerNoteModalFragment();

describe('Customer note suite', { tags: 'smoke' }, () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
  });

  it('should show and hide the customer note modal', () => {
    // open
    pickingListsFragment.getCustomerNoteButtons().click();
    customerNoteFragment.getModal().should('be.visible');

    // close
    customerNoteFragment.getCloseButton().click();
    customerNoteFragment.getModal().should('not.be.visible');
  });
});
