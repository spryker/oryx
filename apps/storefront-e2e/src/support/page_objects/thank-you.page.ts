import { AbstractSFPage } from './abstract.page';

export class ThankYouPage extends AbstractSFPage {
  url: string;

  constructor(orderId: string) {
    super();

    this.url = `/order/${orderId}`;
  }

  waitForLoadedSPA(): void {
    this.waitForLoadedSSR();
  }

  waitForLoadedSSR(): void {
    this.getHeading().should('be.visible');
  }

  getHeading = () => cy.contains('Thank you');
  getConfirmationBanner = () => cy.get('oryx-order-confirmation-banner');
  getConfirmationBannerText = () => this.getConfirmationBanner().find('p');
  getOrderSummary = () => cy.get('oryx-order-summary');
  getOrderDetails = () => this.getOrderSummary().find('section');
}
