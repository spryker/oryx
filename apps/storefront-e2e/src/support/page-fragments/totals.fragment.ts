export class TotalsFragment {
  protected wrapper: string;

  constructor(wrapper: string) {
    this.wrapper = wrapper;
  }

  getWrapper = () => cy.get(this.wrapper);
  getSubtotalText = () => this.getWrapper().find('oryx-cart-totals-subtotal');
  getSubtotalPrice = () => this.getSubtotalText().find('oryx-site-price');
  getDiscountsWrapper = () => this.getWrapper().find('oryx-collapsible');
  getDiscountsTotal = () => this.getDiscountsWrapper().find('[slot="aside"]');
  getTaxTotalPrice = () =>
    this.getWrapper().find('oryx-cart-totals-tax').find('oryx-site-price');
  getTotalPrice = () =>
    this.getWrapper().find('oryx-cart-totals-total').find('oryx-site-price');
  getTaxMessage = () => this.getWrapper().get('.tax-message');
}
