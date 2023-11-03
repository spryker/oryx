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

  checkTotals(totals: {
    subTotal?: string;
    discountsTotal?: string;
    taxTotal?: string;
    totalPrice?: string;
  }) {
    this.getWrapper().should('be.visible');

    if (totals.subTotal)
      this.getSubtotalPrice().shadow().should('contain.text', totals.subTotal);

    if (totals.discountsTotal) {
      this.getDiscountsTotal()
        .shadow()
        .should('contain.text', totals.discountsTotal);
    } else this.getDiscountsWrapper().should('not.exist');

    if (totals.totalPrice)
      this.getTotalPrice().shadow().should('contain.text', totals.totalPrice);

    if (totals.taxTotal)
      this.getTaxTotalPrice().shadow().should('contain.text', totals.taxTotal);

    this.getTaxMessage()
      .should('be.visible')
      .and('contain.text', 'Tax included');
  }
}
