import { IPageWithFacets } from './mixins/page-with-facets.mixin';
import { IPageWithProductList } from './mixins/page-with-product-list.mixin';

export function checkProductCardsFilteringByName(
  page: IPageWithFacets & IPageWithProductList,
  numberOfFacets: number,
  numberOfProducts: number,
  query: string
) {
  page.getFacets().getSearchFacets().should('have.length', numberOfFacets);
  page.getProductCards().should('have.length', numberOfProducts);
  page.getProductHeadings().should('contain.text', query);
}

export function checkProductCardsFilteringByPrice(
  page: IPageWithFacets & IPageWithProductList,
  minPrice = 0,
  maxPrice = Infinity
) {
  page
    .getProductPrices()
    .shadow()
    .each(($price: DocumentFragment) => {
      const price = $price.textContent;
      const value = parseFloat(price.replace('€', ''));

      cy.wrap(value).should('be.gte', minPrice);
      cy.wrap(value).should('be.lte', maxPrice);
    });
}

export function checkProductCardsSortingBySku(
  page: IPageWithProductList,
  sortedSkus: string[]
) {
  page.getProductCards().each((card, index) => {
    cy.wrap(card).should('have.attr', 'sku', sortedSkus[index]);
  });
}
