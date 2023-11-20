import { PickerHeaderFragment } from '../support/page_fragments/picker-header.fragment';
import { PickerPage } from '../support/page_objects/picker.page';

// TODO: ????
const pickingListId = 'd5bf20f1-7f36-568d-85b5-e4502acbcc82';
const pickerPage = new PickerPage(pickingListId);
const pickerHeaderFragment = new PickerHeaderFragment();

describe('picking header with no customer note', () => {
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
