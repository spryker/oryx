import { LandingPage } from '../support/page_objects/landing.page';
import { LoginPage } from '../support/page_objects/login.page';
import { TestCustomerData } from '../types/user.type';

const loginPage = new LoginPage();
const landingPage = new LandingPage();

describe('Authentication suite', () => {
  context('Login functionality', () => {
    it('must allow user to login with valid credentials', () => {
      cy.login();

      cy.location('pathname').should('be.eq', landingPage.url);
    });

    it('must show and error message if a user logs in with invalid credentials', () => {
      const invalidUser: TestCustomerData = {
        name: 'Sonia',
        email: 'sonia@spryker.com',
        password: 'change123123',
      };

      const loginPage = new LoginPage();

      loginPage.visit();
      loginPage.loginForm.login(invalidUser);

      loginPage.header
        .getUserSummaryHeading()
        .should('not.contain', invalidUser.name);

      loginPage.header.getUserSummaryHeading().should('contain', 'login');
      loginPage.loginForm.getBEValidationError().should('be.visible');
    });
  });

  context('Logout functionality', () => {
    it.only('User is able to logout', { tags: 'smoke' }, () => {
      cy.login();

      cy.location('pathname').should('be.eq', landingPage.url);

      landingPage.header.logout();

      cy.location('pathname').should('be.eq', landingPage.url);
      landingPage.header.getUserSummaryHeading().should('contain', 'login');

      // check that user is still logged out after page change
      loginPage.visit();
      loginPage.header.getUserSummaryHeading().should('contain', 'login');
    });
  });
});
