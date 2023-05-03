import { OauthHandlerFragment } from '../support/page_fragments/oauth-handler.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { LoginPage } from '../support/page_objects/login.page';

const pickingListsFragment = new PickingListsFragment();
const loginPage = new LoginPage();
const oauthHandler = new OauthHandlerFragment();

describe('Login Suite', () => {
  describe('when logged out', () => {
    it('should redirect to login page', () => {
      cy.visit('/');

      cy.location('pathname').should('to.match', /^\/login/);

      loginPage.getWrapper().should('be.visible');
      loginPage.getWrapper().find('oryx-image[resource="logo"]');
      loginPage
        .getWrapper()
        .find('oryx-heading')
        .should('be.visible')
        .and('contain.text', 'Welcome please log in to start picking');
      loginPage.loginForm
        .getWrapper()
        .find('slot[name="label"]')
        .should('have.css', 'position', 'absolute');
    });
  });
  describe('when logging in', () => {
    it('should login successfully', () => {
      cy.intercept('POST', '**/token').as('token');

      loginPage.visit();
      loginPage.loginForm.login({
        email: 'admin@spryker.com',
        password: 'change123',
      });

      cy.wait('@token');

      cy.location('pathname').should('match', /^\/oauth/);
      oauthHandler.getWrapper().should('be.visible');
      oauthHandler
        .getWrapper()
        .should('have.css', 'background-color', 'rgb(17, 133, 110)');
      oauthHandler.getLogo().should('be.visible');
      oauthHandler.getTitle().should('contain.text', 'Logging you in');
      oauthHandler.getSpinner().should('be.visible');

      cy.intercept('GET', '**/picking-lists/*').as('picking-lists');
      cy.wait('@picking-lists');

      cy.location('pathname').should('be.equal', '/');
      pickingListsFragment.getWrapper().should('be.visible');
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
      loginPage
        .getWrapper()
        .find('oryx-notification[type="error"]')
        .should('be.visible');
    });
  });
});
