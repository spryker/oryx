import { OauthHandlerFragment } from '../support/page_fragments/oauth-handler.fragment';
import { LoginPage } from '../support/page_objects/login.page';
import { WarehouseSelectionListFragment } from '../support/page_fragments/warehouse-selection-list.fragment';

const warehouseSelectionListFragment = new WarehouseSelectionListFragment();
const loginPage = new LoginPage();
const oauthHandler = new OauthHandlerFragment();

describe('Login Suite', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
  });

  describe('when logged out', () => {
    it('should redirect to login page', () => {
      cy.visit('/');

      cy.location('pathname').should('to.match', /^\/login/);

      loginPage.getWrapper().should('be.visible');
      loginPage.getLogo().should('be.visible');
      loginPage.getTitle().should('be.visible');
    });

    // logging in
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

    cy.wait('@warehouse-user-assignments');

    cy.location('pathname').should('be.equal', '/warehouse-selection');
    warehouseSelectionListFragment.getWrapper().should('be.visible');
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
