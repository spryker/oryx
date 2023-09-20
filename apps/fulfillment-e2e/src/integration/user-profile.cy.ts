import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { UserProfileFragment } from '../support/page_fragments/user-profile-modal.fragment';
import { LoginPage } from '../support/page_objects/login.page';
import { PickingHeaderFragment } from '../support/page_fragments/picking-header.fragment';
import { PickingListsHeaderFragment } from '../support/page_fragments/picking-lists-header.fragment';

const pickingListsFragment = new PickingListsFragment();
const userProfileFragment = new UserProfileFragment();
const loginPage = new LoginPage();
const pickingHeaderFragment = new PickingHeaderFragment();
const pickingListsHeaderFragment = new PickingListsHeaderFragment();

describe('When a user opens the user profile modal', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    pickingListsHeaderFragment.getUserIcon().click();
  });

  it('should display modal', () => {
    userProfileFragment.getWrapper().should('be.visible');
    userProfileFragment.getLogOutButton().should('be.visible');
    userProfileFragment.getNotification().should('not.exist');
  });

  describe('and user clicks on log out button', () => {
    beforeEach(() => {
      userProfileFragment.getLogOutButton().click();
    });

    it('should log out user', () => {
      cy.location('pathname').should('to.match', /^\/login/);
      loginPage.getWrapper().should('be.visible');
    });
  });

  describe('and sync is pending', () => {
    beforeEach(() => {
      cy.mockSyncPending();
      cy.visit('/');

      pickingListsHeaderFragment.getUserIcon().click();
    });

    it('should show message and disable log out button', () => {
      userProfileFragment.getLogOutButton().should('have.attr', 'disabled');
      userProfileFragment.getNotification().should('be.visible');
      userProfileFragment
        .getNotification()
        .should(
          'contain.text',
          `You can't log out because of a pending synchronization`
        );
    });
  });

  describe('and picking is in progress', () => {
    beforeEach(() => {
      userProfileFragment.getCloseButton().click();
      pickingListsFragment.getStartPickingButtons().eq(1).click();

      pickingHeaderFragment.getUserIcon().click();
    });

    it('should show message and disable log out button', () => {
      userProfileFragment.getLogOutButton().should('have.attr', 'disabled');
      userProfileFragment.getNotification().should('be.visible');
      userProfileFragment
        .getNotification()
        .should(
          'contain.text',
          `You can't log out because picking is in progress`
        );
      userProfileFragment.getReceiveDataButton().should('not.exist');
    });
  });

  // Do we need 'and' part here?
  describe('and sync is pending and picking is in progress', () => {
    beforeEach(() => {
      cy.mockSyncPending();
      cy.visit('/');
      pickingListsFragment.getStartPickingButtons().eq(1).click();

      pickingHeaderFragment.getUserIcon().click();
    });

    it('should show picking in progress message and disable log out button', () => {
      userProfileFragment.getLogOutButton().should('have.attr', 'disabled');
      userProfileFragment.getNotification().should('be.visible');
      userProfileFragment
        .getNotification()
        .should(
          'contain.text',
          `You can't log out because picking is in progress`
        );
      userProfileFragment.getReceiveDataButton().should('not.exist');
    });
  });

  describe('when receive data button is clicked', () => {
    beforeEach(() => {
      cy.intercept('PATCH', '**/picking-lists/**').as('startPicking');

      userProfileFragment.getCloseButton().click();
      pickingListsFragment.getStartPickingButtons().eq(1).click();

      cy.wait('@startPicking', { timeout: 30000 });

      cy.visit('/');

      pickingListsFragment.getPickingListsItems().should('have.length', 1);

      pickingListsHeaderFragment.getUserIcon().click();

      userProfileFragment.getWrapper().should('be.visible');

      userProfileFragment.getReceiveDataButton().click();
    });

    // I actually faced with 502 error manually at this point
    it('should receive data', () => {
      userProfileFragment.getWrapper().should('not.be.visible');
      cy.location('pathname').should('not.to.match', /^\/login/);
      loginPage.getWrapper().should('not.exist');
      pickingListsFragment.getPickingListsItems().should('have.length', 2);
    });
  });
});
