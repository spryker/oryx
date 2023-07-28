import { ContactPage } from '../support/page-objects/contact.page';
import { LandingPage } from '../support/page-objects/landing.page';

const landingPage = new LandingPage();
const contactPage = new ContactPage();

describe('SPA navigation suite', () => {
  describe('when the user clicks on the "Contact us" link', () => {
    beforeEach(() => {
      landingPage.visit();
      landingPage.footer.getLinkByUrl('/contact').click();
    });

    it('should navigate to the Contact page', () => {
      cy.location('pathname').should('be.eq', contactPage.url);
      contactPage.getHeading().should('be.visible');
    });

    describe('and when the user clicks on the logo', () => {
      beforeEach(() => {
        contactPage.visit();
        contactPage.header.getLogo().click();
      });

      it('should navigate the user back to the home page', () => {
        cy.location('pathname').should('be.eq', landingPage.url);
        landingPage.getHeroBanner().should('be.visible');
      });
    });
  });
});
