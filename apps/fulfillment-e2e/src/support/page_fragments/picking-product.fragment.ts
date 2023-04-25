export class PickingProductFragment {
  getProducts = () => cy.get('oryx-picking-product-card');
  getQuantityInput = () => this.getProducts().find('oryx-cart-quantity-input');
  getQuantityInputMinusButton = () => cy.get('button[aria-label="Decrease"]');
  getQuantityInputPlusButton = () => cy.get('button[aria-label="Increase"]');
  getSubmitButton = () => cy.get('oryx-button button');

  pickAllProductItems = () => {
    this.getQuantityInputPlusButton().then(($button) => {
      // click button while it is active
      if ($button.attr('disabled')) {
        return;
      }

      cy.wrap($button).click();
      this.pickAllProductItems();
    });
  };
}
