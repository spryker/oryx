import { IPageWithFacets } from './mixins/page-with-facets.mixin';
import { IPageWithProductList } from './mixins/page-with-product-list.mixin';

export function checkProductCardsFilterringByName(
  page: IPageWithFacets & IPageWithProductList,
  numberOfFacets: number,
  numberOfProducts: number,
  query: string
) {
  page.getFacets().getSearchFacets().should('have.length', numberOfFacets);
  page.getProductCards().should('have.length', numberOfProducts);
  page.getProductHeadings().should('contain.text', query);
}

export function checkProductCardsFilterringByPrice(
  page: IPageWithFacets & IPageWithProductList,
  minPrice = 0,
  maxPrice = Infinity
) {
  page.getProductPrices().should('be.gte', minPrice);
  page.getProductPrices().should('be.lte', maxPrice);
}

export function checkProductCardsSortingBySku(
  page: IPageWithProductList,
  sortedSkus: string[]
) {
  page.getProductCards().each((card, index) => {
    cy.wrap(card).should('have.attr', 'sku', sortedSkus[index]);
  });
}
