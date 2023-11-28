import { AbstractSFPage } from './abstract.page';

export class LandingPage extends AbstractSFPage {
  url = '/';

  beforeVisit(): void {
    cy.intercept(`/catalog-search?*`).as('searchQuery');
  }

  waitForLoaded(): void {
    cy.wait('@searchQuery');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(250);
  }

  getHeroBanner = () => cy.get('oryx-content-image');
  getProductCards = () => {
    return cy.get('oryx-product-card');
  };
  getProductCardPrices = () =>
    this.getProductCards()
      .find('oryx-product-price')
      .find('oryx-site-price')
      .shadow();

  clickOnProductCart = (eq: number) => {
    this.getProductCards().eq(eq).click();
  };
}
