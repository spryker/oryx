export class CartTotalsFragment {
  getWrapper = () => cy.get('oryx-cart-totals');
  getSubtotalText = () => this.getWrapper().contains('Subtotal');
  getSubtotalPrice = () => this.getSubtotalText().next();
  getDiscountsWrapper = () => this.getWrapper().find('.discount');
  getDiscountsTotal = () => this.getDiscountsWrapper().find('[slot="aside"]');
  getTaxTotal = () => this.getWrapper().find('.tax');
  getDeliveryTotalMessage = () => this.getWrapper().find('.delivery-message');
  getTotalPrice = () => this.getWrapper().find('.summary');
  getTaxMessage = () => this.getWrapper().get('.tax-message');
}
