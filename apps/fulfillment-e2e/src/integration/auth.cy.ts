import { defaultUser } from '../support/commands';
import { UserProfileFragment } from '../support/page_fragments/user-profile-modal.fragment';
import { LoadingPage } from '../support/page_objects/loading.page';
import { LoginPage } from '../support/page_objects/login.page';
import { PickingListPage } from '../support/page_objects/picking-list.page';
import { WarehouseSelectionPage } from '../support/page_objects/warehouse-selection.page';

const loginPage = new LoginPage();
const oauthPage = new LoadingPage();
const userProfileFragment = new UserProfileFragment();

describe('Login Suite', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
  });

  it('should redirect to login page, login and logout successfully', () => {
    const warehouseSelectionPage = new WarehouseSelectionPage();
    const pickingListPage = new PickingListPage();

    // redirect
    cy.visit('/');
    verifyLoginPageRedirect();

    // login
    loginPage.login(defaultUser);
    verifyOauthPageRedirect();
    warehouseSelectionPage.waitForLoaded();
    warehouseSelectionPage.selectByEq(0);
    pickingListPage.waitForLoaded();

    // logout
    userProfileFragment.openUserMenu();
    userProfileFragment.logout();
    verifyLoginPageRedirect();
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

function verifyLoginPageRedirect() {
  cy.location('pathname').should('to.match', /^\/login/);
  loginPage.getWrapper().should('be.visible');
}

function verifyOauthPageRedirect() {
  cy.location('pathname').should('match', /^\/oauth/);
  oauthPage.getWrapper().should('be.visible');
}
