import { LandingPage } from '../support/page-objects/landing.page';
import { LoginPage } from '../support/page-objects/login.page';
import { Customer } from '../support/types/user.type';

const loginPage = new LoginPage();
const landingPage = new LandingPage();

describe('Authentication suite', () => {
  it('must allow to login and logout', { tags: 'smoke' }, () => {
    cy.login();
    checkSuccessfulLogin();

    landingPage.header.logout();
    checkSuccessfulLogout();
  });

  it('must show a BE error message if user logs in with invalid credentials', () => {
    const invalidUser: Customer = {
      name: 'Sonia',
      email: 'sonia@spryker.com',
      password: 'change123123',
    };

    loginPage.visit();
    loginPage.loginForm.login(invalidUser);

    checkFailedLogin();
  });
});

function checkFailedLogin() {
  loginPage.header.checkTextInUserSummaryHeading('login');
  loginPage.loginForm.getBEValidationError().should('be.visible');
  loginPage.globalNotificationCenter.getWrapper().should('not.be.visible');
}

function checkSuccessfulLogin() {
  cy.fixture<Customer>('test-customer').then((customer) => {
    landingPage.header.checkTextInUserSummaryHeading(customer.name);
  });
}

function checkSuccessfulLogout() {
  loginPage.header.checkTextInUserSummaryHeading('login');
}
