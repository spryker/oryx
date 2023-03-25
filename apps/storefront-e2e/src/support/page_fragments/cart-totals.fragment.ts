export class CartTotalsFragment {
  getWrapper = () => cy.get('oryx-cart-totals');
  getSubtotalText = () => this.getWrapper().contains('Subtotal');
  getSubtotalPrice = () => this.getSubtotalText().next();
  getDiscountsWrapper = () => this.getWrapper().find('.discount');
  getDiscountsTotal = () => this.getDiscountsWrapper().find('[slot="aside"]');
  getTaxTotal = () => this.getWrapper().contains('Tax').next();
  getDeliveryTotal = () =>
    this.getWrapper().contains('Delivery').next().find('a');
  getTotalPrice = () => this.getWrapper().find('.summary');
  getTaxMessage = () => this.getWrapper().get('.tax-message');
}
