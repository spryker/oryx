export class ProductSortingFragment {
  getWrapper = () => cy.get('oryx-search-product-sort');

  applySorting(sorting: string) {
    this.getWrapper().click();
    cy.get(`oryx-option[value="${sorting}"]`).click();
  }

  clearSorting() {
    this.getWrapper()
      .find('oryx-icon[type="delete_forever"]')
      .trigger('mouseover')
      .click();
  }
}
