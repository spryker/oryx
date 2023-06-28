export class CartTotalsFragment {
  getWrapper = () => cy.get('oryx-cart-totals');
  getSubtotalText = () => this.getWrapper().find('oryx-cart-totals-subtotal');
  getSubtotalPrice = () => this.getSubtotalText().find('oryx-site-price');
  getDiscountsWrapper = () => this.getWrapper().find('oryx-collapsible');
  getDiscountsTotal = () => this.getDiscountsWrapper().find('[slot="aside"]');
  getTaxTotalPrice = () =>
    this.getWrapper().find('oryx-cart-totals-tax').find('oryx-site-price');
  getTotalPrice = () =>
    this.getWrapper().find('oryx-cart-totals-total').find('oryx-site-price');
  getTaxMessage = () => this.getWrapper().get('.tax-message');
  getCartSummary = () => cy.get('oryx-site-navigation-item:nth-of-type(2)');
  getCartSummaryQuantity = () => this.getCartSummary().find('mark');
}
