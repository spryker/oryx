export class PickingFragment {
  getWrapper = () => cy.get('oryx-picking');
  getTabs = () => this.getWrapper().find('oryx-tabs');
  getTabsList = () => this.getWrapper().find('oryx-tab');
  getTabCounter = (tab) => tab.find('oryx-chip');
  getProducts = () => this.getWrapper().find('oryx-picking-product-card');
  getAllItemsDonePlaceholder = () => this.getWrapper().get('.picking-complete');
  getFinishButton = () => this.getWrapper().get('.submit-wrapper');
  getProductDoneButton = (product) => product.find('oryx-button');
  getProductQuantityInput = (product) =>
    product.find('oryx-cart-quantity-input');
  getQuantityIncreaseButton = (quantity) => quantity.find('[part="increase"]');
}
