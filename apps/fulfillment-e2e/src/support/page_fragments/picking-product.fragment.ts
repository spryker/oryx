export class PickingProductFragment {
  getWrapper = () => cy.get('oryx-picking-product-card');
  getQuantityInput = () => this.getWrapper().find('oryx-cart-quantity-input');
  getQuantityInputMinusButton = () =>
    this.getQuantityInput().find('button').eq(0);
  getQuantityInputPlusButton = () => cy.get('button[aria-label="Increase"]');
  getSubmitButton = () => cy.get('oryx-button button');

  pickAllProductItems = () => {
    this.getQuantityInputPlusButton().then(($button) => {
      if ($button.attr('disabled')) {
        return;
      }

      cy.wrap($button).click();
      this.pickAllProductItems();
    });
  };
}
