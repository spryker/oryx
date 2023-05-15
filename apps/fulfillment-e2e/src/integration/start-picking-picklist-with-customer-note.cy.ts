import { CustomerNoteFragment } from '../support/page_fragments/customer-note.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { PickingFragment } from '../support/page_fragments/picking.fragment';

const pickingListsFragment = new PickingListsFragment();
const customerNoteFragment = new CustomerNoteFragment();

describe('Start picking a picklist with customer note', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    pickingListsFragment.getStartPickingButtons().eq(0).click();
  });

  it('check Customer Note page', () => {
    // should display customer note
    customerNoteFragment
      .getNote()
      .should('be.visible')
      .and('contain', 'Some cart note');

    // should display “Customer note” headline
    customerNoteFragment.getHeadline().should('contain', 'Customer note');

    // should display illustration
    customerNoteFragment
      .getIllustration()
      .should('be.visible')
      .and('have.attr', 'resource', 'user-note');

    // should display “Proceed to picking” button
    customerNoteFragment.getProceedToPickingButton().should('be.visible');

    // should display back button
    customerNoteFragment.getNavigateBackButton().should('be.visible');

    //should navigate to Picking Lists page
    customerNoteFragment.getNavigateBackButton().click();
    cy.location('pathname').should('be.eq', `/`);
  });

  describe('and “Proceed to picking” button is clicked', () => {
    const pickingFragment = new PickingFragment();
    beforeEach(() => {
      customerNoteFragment.getProceedToPickingButton().should('be.visible');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(300);
      customerNoteFragment.getProceedToPickingButton().click();
    });

    it('check Picking page', () => {
      // should display tabs
      pickingFragment.getTabs().should('be.visible');

      // should display three tabs
      pickingFragment.getTabsList().should('have.length', 3);
      pickingFragment.getTabsList().eq(0).should('contain.text', 'Not Picked');
      pickingFragment.getTabsList().eq(1).should('contain.text', 'Picked');
      pickingFragment.getTabsList().eq(2).should('contain.text', 'Not Found');

      // should display "Not picked" as selected
      pickingFragment.getTabsList().eq(0).should('have.attr', 'selected');

      // should display correct products number in chip
      pickingFragment.getProducts().then((products) => {
        pickingFragment
          .getTabCounter(pickingFragment.getTabsList().eq(0))
          .should('contain.text', products.length);
      });

      // should display at least one product for picking
      pickingFragment.getProducts().should('have.length.at.least', 1);
    });
  });

  describe('and picking is already in progress', () => {
    beforeEach(() => {
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

      customerNoteFragment.getProceedToPickingButton().should('be.visible');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(300);
      customerNoteFragment.getProceedToPickingButton().click();
    });

    it('should stay on the same page', () => {
      cy.location('pathname').should('to.match', /^\/customer-note-info/);
    });

    it('should show modal', () => {
      customerNoteFragment.pickingInProgressModal
        .getModal()
        .should('have.attr', 'open');
    });

    it('should render picking in progress text', () => {
      customerNoteFragment.pickingInProgressModal
        .getModal()
        .should('contain.text', 'Already in progress');
    });

    describe('and picking in progress modal is closed', () => {
      beforeEach(() => {
        customerNoteFragment.pickingInProgressModal.getCloseButton().click();
      });

      it('should redirect to picking list page', () => {
        cy.location('pathname').should('be.equal', '/');
      });
    });
  });
});
