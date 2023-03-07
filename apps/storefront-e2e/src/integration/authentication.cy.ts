import { defaultUser } from '../support/commands';
import { LandingPage } from '../support/page_objects/landing.page';
import { LoginPage } from '../support/page_objects/login.page';

const loginPage = new LoginPage();
const landingPage = new LandingPage();

describe('Authentication suite', () => {
  context('Login functionality', () => {
    it('must allow user to login with valid credentials', () => {
      cy.login(defaultUser);

      loginPage.header
        .getUserSummaryHeading()
        .should('contain', defaultUser.name);

      cy.location('pathname').should('be.eq', landingPage.url);
    });

    it('must show and error message if a user logs in with invalid credentials', () => {
      cy.login({
        id: 'DE--1',
        name: 'Sonia',
        email: 'sonia@spryker.com',
        password: 'change123123',
      });

      loginPage.header.getUserSummaryHeading().should('contain', 'Login');
      loginPage.loginForm.getBEValidationError().should('be.visible');
    });
  });

  context('Logout functionality', () => {
    it('User is able to logout', () => {
      cy.login(defaultUser);

      cy.location('pathname').should('be.eq', landingPage.url);
      // there is no other way to detect that hydration is finished
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);

      landingPage.header.logout();

      cy.location('pathname').should('be.eq', landingPage.url);
      landingPage.header.getUserSummaryHeading().should('contain', 'Login');

      // check that user is still logged out after page change
      loginPage.visit();
      loginPage.header.getUserSummaryHeading().should('contain', 'Login');
    });
  });
});
