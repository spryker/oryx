import { CustomerNoteFragment } from '../support/page_fragments/customer-note.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { PickingFragment } from '../support/page_fragments/picking.fragment';

const pickingListsFragment = new PickingListsFragment();
const customerNoteFragment = new CustomerNoteFragment();

describe('Start picking a picklist with customer note', () => {
  let identifier = '';

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/');
    pickingListsFragment
      .getCustomerNoteButton()
      .parents('oryx-picking-list-item')
      .within(() => {
        pickingListsFragment
          .getIdentifier(true)
          .invoke('text')
          .then((text) => {
            identifier = text.trim();

            pickingListsFragment.getStartPickingButton(true).click();
          });
      });
  });

  it('should navigate to correct url', () => {
    cy.url().should('include', `/customer-note-info/${identifier}`);
  });

  it('should display customer note', () => {
    customerNoteFragment
      .getNote()
      .should('be.visible')
      .and('contain', 'Some cart note');
  });

  it('should display “Customer note” headline', () => {
    customerNoteFragment.getHeadline().should('contain', 'Customer note');
  });

  it('should display illustration', () => {
    customerNoteFragment
      .getIllustration()
      .should('be.visible')
      .and('have.attr', 'resource', 'user-note');

    customerNoteFragment
      .getIllustration()
      .invoke('outerWidth')
      .should('be.eq', 250);

    customerNoteFragment
      .getIllustration()
      .invoke('outerHeight')
      .should('be.eq', 250);
  });

  it('should display back button', () => {
    customerNoteFragment.getNavigateBackButton().should('be.visible');
  });

  it('should display “Proceed to picking” button', () => {
    customerNoteFragment.getProceedToPickingButton().should('be.visible');
  });

  describe('and "back" button is clicked', () => {
    beforeEach(() => {
      customerNoteFragment.getNavigateBackButton().click();
    });

    it('should navigate to Picking Lists page', () => {
      cy.location('pathname').should('be.eq', `/`);
    });
  });

  describe('and “Proceed to picking” button is clicked', () => {
    const pickingFragment = new PickingFragment();
    beforeEach(() => {
      customerNoteFragment.getProceedToPickingButton().should('be.visible');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(300);
      customerNoteFragment.getProceedToPickingButton().click();
    });

    it('should navigate to picking page', () => {
      cy.location('pathname').should(
        'be.eq',
        `/picking-list/picking/${identifier}`
      );
    });

    it('should display tabs', () => {
      pickingFragment.getTabs().should('be.visible');
    });

    it('should display three tabs', () => {
      pickingFragment.getTabsList().should('have.length', 3);
      pickingFragment.getTabsList().eq(0).should('contain.text', 'Not Picked');
      pickingFragment.getTabsList().eq(1).should('contain.text', 'Picked');
      pickingFragment.getTabsList().eq(2).should('contain.text', 'Not Found');
    });

    it('should display "Not picked" as selected', () => {
      pickingFragment.getTabsList().eq(0).should('have.attr', 'selected');
    });

    it('should display correct products number in chip', () => {
      pickingFragment.getProducts().then((products) => {
        pickingFragment
          .getTabCounter(pickingFragment.getTabsList().eq(0))
          .should('contain.text', products.length);
      });
    });

    it('should display at least one product for picking', () => {
      pickingFragment.getProducts().should('have.length.at.least', 1);
    });
  });
});
