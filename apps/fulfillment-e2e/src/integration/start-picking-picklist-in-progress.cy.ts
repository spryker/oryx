import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();

describe('pick a picking list in progress', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    cy.pickingInProgress();

    pickingListsFragment.getStartPickingButtons().eq(1).should('be.visible');
    pickingListsFragment.getStartPickingButtons().eq(1).click();
  });

  it('should stay on the same page and show modal', () => {
    cy.location('pathname').should('be.equal', '/');
    pickingListsFragment.pickingInProgressModal
      .getModal()
      .should('have.attr', 'open');
    pickingListsFragment.pickingInProgressModal
      .getModal()
      .should('contain.text', 'Already in progress');
  });

  describe('and picking in progress modal is closed', () => {
    beforeEach(() => {
      pickingListsFragment.pickingInProgressModal.getCloseButton().click();
    });

    it('should hide modal', () => {
      pickingListsFragment.pickingInProgressModal
        .getModal()
        .should('not.have.attr', 'open');
    });
  });
});
