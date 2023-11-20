import { defaultUser } from '../support/commands';
import { OauthHandlerFragment } from '../support/page_fragments/oauth-handler.fragment';
import { LoginPage } from '../support/page_objects/login.page';
import { WarehouseSelectionPage } from '../support/page_objects/warehouse-selection.page';

const loginPage = new LoginPage();
const oauthHandler = new OauthHandlerFragment();

describe('Login Suite', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
  });

  it('should redirect to login page and login successfully', () => {
    const warehouseSelectionPage = new WarehouseSelectionPage();

    // go to home
    cy.visit('/');

    // check redirect
    cy.location('pathname').should('to.match', /^\/login/);
    loginPage.getWrapper().should('be.visible');

    // login
    cy.intercept('POST', '**/token').as('token');
    loginPage.loginForm.login(defaultUser);
    cy.wait('@token');

    // check preloader page
    cy.location('pathname').should('match', /^\/oauth/);
    oauthHandler.getWrapper().should('be.visible');

    // check warehouse redirect after successful login
    warehouseSelectionPage.waitForLoaded();
  });

  it('should display error notification when credentials are not valid', () => {
    loginPage.visit();
    loginPage.loginForm.login({
      email: 'admin@spryker.com',
      password: '123abc',
      warehouseName: '123',
    });

    cy.location('pathname').should('match', /^\/login/);
    loginPage.getErrorNotification().should('be.visible');
  });
});
