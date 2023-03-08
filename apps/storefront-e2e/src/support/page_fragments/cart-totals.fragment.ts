export class CartTotalsFragment {
  getWrapper = () => cy.get('cart-totals');
  getSubtotalText = () => this.getWrapper().contains('Subtotal');
  getSubtotalPrice = () => this.getSubtotalText().next();
  getDiscountsWrapper = () => this.getWrapper().find('.discount');
  getDiscountsTotal = () => this.getDiscountsWrapper().find('[slot="aside"]');
  getTaxTotal = () => this.getWrapper().contains('Tax').next();
  getDeliveryTotal = () => this.getWrapper().contains('Delivery').next();
  getTotalPrice = () => this.getWrapper().find('.summary');
  getTaxMessage = () => this.getWrapper().get('.tax-message');
}
