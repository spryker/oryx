export class ProductFragment {
  getProducts = () => cy.get('oryx-picking-product-card', { timeout: 10000 });
  getQuantityInput = () => this.getProducts().find('oryx-cart-quantity-input');
  getQuantityInputField = () =>
    cy
      .get('oryx-cart-quantity-input')
      .find('oryx-input')
      .find('input[type="number"]');
  getQuantityInputMinusButton = () => cy.get('button[aria-label="Decrease"]');
  getQuantityInputPlusButton = () => cy.get('button[aria-label="Increase"]');
  getSubmitButton = () => cy.get('oryx-button');

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
