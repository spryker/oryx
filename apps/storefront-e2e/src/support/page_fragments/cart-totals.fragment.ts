export class CartTotalsFragment {
  getWrapper = () => cy.get('oryx-cart-totals');
  getSubtotalText = () => this.getWrapper().find('oryx-cart-totals-subtotal');
  getSubtotalPrice = () => this.getSubtotalText().find('span:nth-child(2)');
  getDiscountsWrapper = () => this.getWrapper().find('oryx-collapsible');
  getDiscountsTotal = () => this.getDiscountsWrapper().find('[slot="aside"]');
  getTaxTotalPrice = () =>
    this.getWrapper().find('oryx-cart-totals-tax').find('span:nth-child(2)');
  getTotalPrice = () =>
    this.getWrapper().find('oryx-cart-totals-total').find('span:nth-child(2)');
  getTaxMessage = () => this.getWrapper().get('.tax-message');
  getCartSummary = () => cy.get('oryx-site-navigation-item:nth-of-type(2)');
  getCartSummaryQuantity = () => this.getCartSummary().find('mark');
}
