import { AbstractSFPage } from './abstract.page';

export class LandingPage extends AbstractSFPage {
  url = '/';

  waitForLoaded(): void {
    // no need to wait for anything (previously we waited for youtube video)
  }

  getHeroBanner = () => cy.get('oryx-content-image');
  getProductCards = () => cy.get('oryx-product-card');
  getProductCardPrices = () =>
    this.getProductCards()
      .find('oryx-product-price')
      .find('oryx-site-price')
      .shadow();
}
