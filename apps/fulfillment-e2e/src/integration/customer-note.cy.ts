import { CustomerNoteModalFragment } from '../support/page_fragments/customer-note-modal.fragment';
import { ListsFragment } from '../support/page_fragments/lists.fragment';

const listsFragment = new ListsFragment();
const customerNoteFragment = new CustomerNoteModalFragment();

describe('Customer note suite', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
  });

  it('should show and hide the customer note modal', () => {
    // open
    listsFragment.getCustomerNoteButtons().click();
    customerNoteFragment.getModal().should('be.visible');

    // close
    customerNoteFragment.getCloseButton().click();
    customerNoteFragment.getModal().should('not.be.visible');
  });
});