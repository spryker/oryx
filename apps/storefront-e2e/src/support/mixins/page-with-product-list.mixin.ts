import { E2EPage } from '../page-objects/abstract.page';
import { Constructor } from '../types/utils.types';

export interface IPageWithProductList {
  getProductCards(): Cypress.Chainable<JQuery<HTMLElement>>;
  getProductHeadings(): Cypress.Chainable<JQuery<HTMLElement>>;
  getProductPrices(): Cypress.Chainable<JQuery<HTMLElement>>;
}

export function WithProductList<TPage extends Constructor<E2EPage>>(
  Page: TPage
) {
  return class PageWithProductList
    extends Page
    implements IPageWithProductList
  {
    constructor(...args: any[]) {
      super(...args);

      this.initSearchInterceptor();
    }

    initSearchInterceptor(): void {
      cy.intercept('/catalog-search?**').as('catalogSearch');
    }

    waitForSearchRequest(): void {
      cy.wait('@catalogSearch');

      this.waitForTemplateRebuild();
    }

    waitForTemplateRebuild(): void {
      // wait till product cards and facets are re-renreded after search
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
    }

    waitForLoaded(): void {
      super.waitForLoaded();
      this.waitForSearchRequest();
    }

    getProductCards = () => cy.get('oryx-product-card');
    getProductHeadings = () => this.getProductCards().find('oryx-heading');
    getProductPrices = () =>
      this.getProductCards()
        .find('oryx-product-price')
        .find('oryx-site-price[part="sales"]');
  };
}
