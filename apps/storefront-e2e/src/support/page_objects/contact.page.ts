import { AbstractSFPage } from './abstract.page';

export class ContactPage extends AbstractSFPage {
  url = '/contact';

  waitForLoadedSSR(): void {
    this.getHeading().should('be.visible');
  }

  waitForLoadedSPA(): void {
    this.waitForLoadedSSR()
  }

  getHeading = () => cy.contains('This is Contact Page element.');
}
