export class ProductReferencesFragment {
  getWrapper = () => cy.get('oryx-product-references');
  getProducts = () => this.getWrapper().find('oryx-product-card');
}
