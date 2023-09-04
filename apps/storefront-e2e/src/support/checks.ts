import {
  IPageWithFacets,
  IPageWithProductList,
} from './interfaces/page-interfaces';

export function checkProductCardsFilterring(
  page: IPageWithFacets & IPageWithProductList,
  numberOfFacets: number,
  numberOfProducts: number,
  query: string
) {
  page.getFacets().getSearchFacets().should('have.length', numberOfFacets);
  page.getProductCards().should('have.length', numberOfProducts);
  page.getProductHeadings().should('contain.text', query);
}

export function checkProductCardsSortingBySku(
  page: IPageWithProductList,
  sortedSkus: string[]
) {
  page.getProductCards().each((card, index) => {
    cy.wrap(card).should('have.attr', 'sku', sortedSkus[index]);
  });
}
