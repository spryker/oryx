import { OauthHandlerFragment } from '../support/page_fragments/oauth-handler.fragment';
import { PickingListsHeaderFragment } from '../support/page_fragments/picking-lists-header.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { LoginPage } from '../support/page_objects/login.page';

const pickingListsFragment = new PickingListsFragment();
const headerFragment = new PickingListsHeaderFragment();
const loginPage = new LoginPage();
const oauthHandler = new OauthHandlerFragment();

describe('Login Suite', () => {
  describe('when logged out', () => {
    it('should redirect to login page', () => {
      cy.visit('/');

      cy.location('pathname').should('to.match', /^\/login/);

      loginPage.getWrapper().should('be.visible');
      loginPage.getLogo().should('be.visible');
      loginPage.getTitle().should('be.visible');
    });
  });

  describe('when logging in', () => {
    it('should login successfully', () => {
      cy.intercept('POST', '**/token').as('token');
      cy.intercept('GET', '**/picking-lists?include*').as('picking-lists');

      loginPage.visit();
      loginPage.loginForm.login({
        email: 'admin@spryker.com',
        password: 'change123',
      });

      cy.wait('@token');

      cy.location('pathname').should('match', /^\/oauth/);

      oauthHandler.getWrapper().should('be.visible');
      oauthHandler.getLogo().should('be.visible');
      oauthHandler.getTitle().should('be.visible');
      oauthHandler.getSpinner().should('be.visible');

      cy.wait('@picking-lists');

      cy.location('pathname').should('be.equal', '/');
      pickingListsFragment.getWrapper().should('be.visible');
      headerFragment.getSearchIcon().should('be.visible');
      headerFragment.getUserIcon().should('be.visible');
      headerFragment.getHeadline().should('contain.text', 'Pick lists');
      pickingListsFragment.getSortButton().should('be.visible');
    });
  });

  describe('when login fails', () => {
    it('should display error notification', () => {
      cy.intercept('POST', '**/authorize', {
        status: 400,
        code: 'invalid_grant',
        message: 'The user credentials were incorrect.',
      }).as('authorize');

      loginPage.visit();
      loginPage.loginForm.login({
        email: 'admin@spryker.com',
        password: 'change123',
      });

      cy.wait('@authorize');

      cy.location('pathname').should('match', /^\/login/);
      loginPage.getErrorNotification().should('be.visible');
    });
  });
});
