import { CustomerNoteFragment } from '../support/page_fragments/customer-note.fragment';
import { DiscardModalFragment } from '../support/page_fragments/discard-modal.fragment';
import { ListsFragment } from '../support/page_fragments/lists.fragment';
import { PickerHeaderFragment } from '../support/page_fragments/picker-header.fragment';
import { PickerFragment } from '../support/page_fragments/picker.fragment';

const listsFragment = new ListsFragment();
const customerNoteFragment = new CustomerNoteFragment();
const pickerHeaderFragment = new PickerHeaderFragment();
const discardModalFragment = new DiscardModalFragment();

// TODO: this is not E2E, these are component tests
describe('Start picking a picklist with customer note', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    listsFragment.getStartPickingButtons().eq(0).click();
  });

  it('check Customer Note page', () => {
    // should display customer note
    customerNoteFragment
      .getNote()
      .should('be.visible')
      // TODO: hardcoded data
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
    const pickingFragment = new PickerFragment();
    beforeEach(() => {
      customerNoteFragment.getProceedToPickingButton().should('be.visible');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      customerNoteFragment.getProceedToPickingButton().click();
    });

    // TODO: this test checks too many areas of the application
    // everything here should be covered by component tests
    it('check Picking page', () => {
      // should display tabs
      pickingFragment.getTabs().should('be.visible');

      // should display three tabs
      pickingFragment.getTabsList().should('have.length', 3);
      pickingFragment.getTabsList().eq(0).should('contain.text', 'Not Picked');
      pickingFragment.getTabsList().eq(1).should('contain.text', 'Picked');
      pickingFragment.getTabsList().eq(2).should('contain.text', 'Not Found');

      // See discard modal by clicking on back button
      // Due to a cypress bug https://github.com/cypress-io/cypress/issues/26905,
      // the only meaningful way to check visibility is in the slots.
      discardModalFragment.getContent().should('not.be.visible');
      pickerHeaderFragment.getBackButton().click();
      discardModalFragment.getContent().should('be.visible');

      // should hide discard modal
      discardModalFragment.getCancelButton().click();
      discardModalFragment.getContent().should('not.be.visible');
      cy.location('pathname').should('to.match', /^\/picking-list/);

      // should navigate back
      pickerHeaderFragment.getBackButton().click();
      discardModalFragment.getDiscardButton().click();
      cy.location('pathname').should('to.match', /^\/customer-note-info/);

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      customerNoteFragment.getProceedToPickingButton().click();

      // See discard modal by clicking on browser back button
      discardModalFragment.getContent().should('not.be.visible');
      cy.go('back');
      discardModalFragment.getContent().should('be.visible');

      // should hide discard modal
      discardModalFragment.getCancelButton().click();
      discardModalFragment.getContent().should('not.be.visible');
      cy.location('pathname').should('to.match', /^\/picking-list/);

      // should navigate back
      cy.go('back');
      discardModalFragment.getDiscardButton().click();
      cy.location('pathname').should('to.match', /^\/customer-note-info/);

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      customerNoteFragment.getProceedToPickingButton().click();

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
      // TODO: remove mock
      cy.mockPickingInProgress();

      customerNoteFragment.getProceedToPickingButton().should('be.visible');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      customerNoteFragment.getProceedToPickingButton().click();
    });

    // TODO: component test
    it('should show modal and stay on the same page', () => {
      cy.location('pathname').should('to.match', /^\/customer-note-info/);
      customerNoteFragment.pickingInProgressModal
        .getModal()
        .should('have.attr', 'open');
      customerNoteFragment.pickingInProgressModal
        .getModal()
        .should('contain.text', 'Already in progress');
    });

    // TODO: component test
    describe('and modal is dismissed', () => {
      beforeEach(() => {
        customerNoteFragment.pickingInProgressModal.getOverlay().click();
      });

      it('should stay on the same page', () => {
        cy.location('pathname').should('to.match', /^\/customer-note-info/);
      });
    });

    // TODO: unit test
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
