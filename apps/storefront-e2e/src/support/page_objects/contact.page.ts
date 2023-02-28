import { AbstractSFPage } from './abstract.page';

export class ContactPage extends AbstractSFPage {
  url = '/contact';

  waitForLoaded(): void {
    this.getHeading().should('be.visible');
  }

  getHeading = () => cy.contains('oryx-heading', 'Contact Us');
}
