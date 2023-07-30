import { ContactPage } from '../support/page-objects/contact.page';
import { LandingPage } from '../support/page-objects/landing.page';

const landingPage = new LandingPage();
const contactPage = new ContactPage();

describe('SPA navigation suite', () => {
  it('must change pages when user clicks on different links', () => {
    landingPage.visit();
    landingPage.footer.getLinkByUrl('/contact').click();

    checkIfContactPageIsOpened();

    contactPage.header.getLogo().click();

    checkIfHomePageIsOpened();
  });
});

function checkIfContactPageIsOpened() {
  cy.location('pathname').should('be.eq', contactPage.url);
  contactPage.getHeading().should('be.visible');
}

function checkIfHomePageIsOpened() {
  cy.location('pathname').should('be.eq', landingPage.url);
  landingPage.getHeroBanner().should('be.visible');
}
