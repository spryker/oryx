import { AbstractSFPage } from './abstract.page';

export class ThankYouPage extends AbstractSFPage {
  url: string;

  constructor(orderId: string) {
    super();

    this.url = `/checkout/${orderId}`;
  }

  waitForLoadedSPA(): void {
    this.waitForLoadedSSR();
  }

  waitForLoadedSSR(): void {
    this.getHeading().should('be.visible');
  }

  getHeading = () => cy.contains('Thank you');
}
