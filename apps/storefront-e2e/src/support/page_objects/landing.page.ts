import { AbstractSFPage } from './abstract.page';

export class LandingPage extends AbstractSFPage {
  url = '/';

  waitForLoadedSSR(): void {
    cy.intercept('/youtubei/v1/next?*').as('youtubeVideoLoad');
    cy.wait('@youtubeVideoLoad');
  }

  waitForLoadedSPA(): void {
    this.waitForLoadedSSR();
  }

  getVideo = () => cy.get('oryx-video');
  getProductCards = () => cy.get('oryx-product-card');
  getProductCardPrices = () =>
    this.getProductCards().find('oryx-product-price').find('span');
}
