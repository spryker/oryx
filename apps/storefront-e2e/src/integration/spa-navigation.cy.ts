import { ContactPage } from '../support/page_objects/contact.page';
import { LandingPage } from '../support/page_objects/landing.page';

const landingPage = new LandingPage();
const contactPage = new ContactPage();

describe('SPA mode navigation tests', () => {
  it('must navigate to Contact page from header', () => {
    landingPage.visit();
    landingPage.header.getContactLink().click();

    cy.location('pathname').should('be.eq', contactPage.url);
    contactPage.getHeading().should('be.visible');
  });

  it('must navigate to Home page from other pages', () => {
    contactPage.visit();
    contactPage.header.getLogo().click();

    cy.location('pathname').should('be.eq', landingPage.url);
    landingPage.video().should('be.visible')
  });
});
