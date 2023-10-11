export class ProductSortingFragment {
  getWrapper = () => cy.get('oryx-search-product-sort');

  applySorting(sorting: string) {
    this.getWrapper().click({ force: true });
    cy.get(`oryx-option[value="${sorting}"]`).click({ force: true });
  }

  clearSorting() {
    this.getWrapper().find('oryx-icon.clear-button').click({ force: true });
  }
}
