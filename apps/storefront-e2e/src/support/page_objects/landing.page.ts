import { AbstractSFPage } from './abstract.page';

export class LandingPage extends AbstractSFPage {
  url = '/';

  waitForLoaded(): void {
    this.getVideo().should('be.visible');
  }

  getVideo = () => cy.get('oryx-video');
  getProductCards = () => cy.get('oryx-product-card');
  getProductCardPrices = () =>
    this.getProductCards().find('oryx-product-price').find('span');
}
