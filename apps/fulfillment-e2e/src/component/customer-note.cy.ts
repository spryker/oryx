import { CustomerNoteModalFragment } from '../support/page_fragments/customer-note-modal.fragment';
import { ListsFragment } from '../support/page_fragments/lists.fragment';

const listsFragment = new ListsFragment();
const customerNoteFragment = new CustomerNoteModalFragment();

// TODO: this is not E2E, these are component tests
xdescribe('Customer note suite', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
  });

  // TODO: test requires an order with customer note which is not supported by Glue
  it('should show and hide the customer note modal', () => {
    // open
    listsFragment.getCustomerNoteButtons().click();
    customerNoteFragment.getModal().should('be.visible');

    // close
    customerNoteFragment.getCloseButton().click();
    customerNoteFragment.getModal().should('not.be.visible');
  });
});
