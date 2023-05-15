import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();

describe('pick a picking list in progress', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    cy.intercept('PATCH', '**/picking-lists/*', {
      statusCode: 409,
      body: {
        errors: [
          {
            message: 'Picklist is already being picked by another user.',
            status: 409,
            code: '5310',
          },
        ],
      },
    }).as('picking-in-progress');

    pickingListsFragment.getStartPickingButtons().eq(1).should('be.visible');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300);
    pickingListsFragment.getStartPickingButtons().eq(1).click();
  });

  it('should stay on the same page', () => {
    cy.location('pathname').should('be.equal', '/');
  });

  it('should show modal', () => {
    pickingListsFragment.pickingInProgressModal
      .getModal()
      .should('have.attr', 'open');
  });

  it('should render picking in progress text', () => {
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
