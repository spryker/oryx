import { PickerHeaderFragment } from '../support/page_fragments/picker-header.fragment';
import { PickingPage } from '../support/page_objects/picking.page';

// TODO: ????
const pickingListId = 'd5bf20f1-7f36-568d-85b5-e4502acbcc82';
const pickerPage = new PickingPage(pickingListId);
const pickerHeaderFragment = new PickerHeaderFragment();

// TODO: this is not E2E, these are component tests
xdescribe('picking header with no customer note', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    // TODO: ????
    pickerPage.visit();
  });

  it('should not display customer note icon', () => {
    pickerHeaderFragment.getCustomerNoteIcon().should('not.exist');
  });
});
