import { AbstractSFPage } from './abstract.page';

export class ContactPage extends AbstractSFPage {
  url = '/contact';

  waitForLoaded(): void {
    this.getHeading().should('be.visible');
  }

  getHeading = () =>
    cy.contains(
      cy.isB2B()
        ? 'This is B2B Contact Page element.'
        : 'This is Contact Page element.'
    );
}
