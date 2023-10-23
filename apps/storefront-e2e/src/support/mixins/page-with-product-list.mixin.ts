import { E2EPage } from '../page-objects/abstract.page';
import { SearchParameters } from '../types/domain.types';
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

    waitForSearchRequest(params?: Record<string, string>): void {
      cy.wait('@catalogSearch').then((interception) => {
        //check params in request
        if (params) {
          this.compareParams(interception.request.url.split('?')[1], params);
        }
      });

      // wait till product cards are re-renreded after search
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
    }

    checkUrlParams(params: SearchParameters): void {
      cy.location().should(({ search }) => {
        this.compareParams(search, params);
      });
    }

    waitForLoaded(): void {
      super.waitForLoaded();
      this.waitForSearchRequest();
    }

    getProductCards = () => cy.get('oryx-product-card');
    getProductHeadings = () => this.getProductCards().find('oryx-heading');
    getProductPrices = () => this.getProductCards().find('oryx-product-price');

    protected compareParams(
      urlParams: string,
      params: Record<string, string>
    ): void {
      const searchParams = new URLSearchParams(urlParams);
      Object.entries(params).forEach(([param, value]) => {
        expect(searchParams.get(param)).to.equal(value);
      });
    }
  };
}
