export class HeaderFragment {
  getWrapper = () => cy.get('[uid="header"]');

  getContactLink = () => this.getWrapper().find('oryx-content-link').find('a');

  getCurrencySelector = () =>
    this.getWrapper().find('oryx-site-currency-selector');
  getCurrencyButton = () =>
    this.getCurrencySelector().find('oryx-button').find('button');

  getLogo = () =>
    this.getWrapper().find('oryx-content-banner').find('a[href="/"]');

  getUserSummary = () => cy.get('oryx-user-summary');
  getUserSummaryHeading = () => this.getUserSummary().find('oryx-heading');
  getUserSummaryMenu = () => this.getUserSummary().find('oryx-dropdown');
  getOpenUserMenuButton = () =>
    this.getUserSummaryMenu().find('oryx-button').eq(0);
  getLogoutButton = () => this.getUserSummaryMenu().find('oryx-auth-logout');

  getCartSummary = () => cy.get('oryx-cart-summary');
  getCartCount = () => this.getCartSummary().find('mark');

  logout = () => {
    this.getOpenUserMenuButton().click();
    this.getUserSummaryMenu().should('have.attr', 'open');

    this.getLogoutButton().click();
  };

  changeCurrency = (currency: string) => {
    // hydrate
    this.getCurrencyButton().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    this.getCurrencyButton().click();
    this.getCurrencySelector().find(`oryx-option[value="${currency}"]`).click();
  };
}
