import { defaultUser } from '../support/commands';
import { LandingPage } from '../support/page_objects/landing.page';
import { LoginPage } from '../support/page_objects/login.page';

const loginPage = new LoginPage();
const landingPage = new LandingPage();

describe('Authentication suite', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  context('Login functionality', () => {
    it('User is able to log in', () => {
      cy.login();

      loginPage.header.getUserSummaryHeading().should('contain', defaultUser.name);
      cy.location('pathname').should('be.eq', landingPage.url);
    });

    it('An error message is displayed if the User logs in with invalid credentials', () => {
      cy.login({ email: 'sonia@spryker.com', password: 'change123123' });

      loginPage.header.getUserSummaryHeading().should('contain', 'Login');
      loginPage.loginForm.getBEValidationError().should('be.visible');
    });
  })

  context('Logout functionality', () => {
    it('User is able to logout', () => {
      cy.login();
      landingPage.header.logout();

      cy.location('pathname').should('be.eq', landingPage.url);
      landingPage.header.getUserSummaryHeading().should('contain', 'Login');

      // check that user is still logged out after page change
      loginPage.visit();
      loginPage.header.getUserSummaryHeading().should('contain', 'Login');
    });
  });
});
