export class ProductReferencesFragment {
  getWrapper = () => cy.get('oryx-product-relations');
  getProducts = () => this.getWrapper().find('oryx-product-card');
}
