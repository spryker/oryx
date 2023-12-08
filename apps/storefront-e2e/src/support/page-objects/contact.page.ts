import { isB2B } from '../index';
import { AbstractSFPage } from './abstract.page';

export class ContactPage extends AbstractSFPage {
  url = '/contact';

  waitForLoaded(): void {
    this.getHeading().should('be.visible');
  }

  getHeading = () =>
    cy.contains(
      isB2B()
        ? 'This is B2B Contact Page element.'
        : 'This is Contact Page element.'
    );

  updateUrl = (url: string) => (this.url = url);
}
