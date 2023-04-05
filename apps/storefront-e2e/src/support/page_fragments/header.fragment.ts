export class HeaderFragment {
  getWrapper = () => cy.get('[uid="header"]');

  getLocaleSelector = () =>
    this.getWrapper().find('oryx-site-locale-selector');
  getLocaleButton = () =>
    this.getLocaleSelector().find('oryx-button').find('button');

  getUserSummary = () => cy.get('oryx-user-summary');
  getUserSummaryHeading = () => this.getUserSummary().find('oryx-heading');
  getUserSummaryMenu = () => this.getUserSummary().find('oryx-dropdown');
  getOpenUserMenuButton = () =>
    this.getUserSummaryMenu().find('oryx-button').eq(0);
  getLogoutButton = () =>
    this.getUserSummaryMenu().find('oryx-auth-login-link');

  getCartSummary = () => cy.get('oryx-cart-summary');
  getCartCount = () => this.getCartSummary().find('mark');

  getLogo = () =>
    this.getWrapper().find('oryx-content-banner').find('a[href="/"]');
  getContactLink = () => this.getWrapper().find('oryx-content-link').find('a');

  logout = () => {
    this.getOpenUserMenuButton().click();
    this.getUserSummaryMenu().should('have.attr', 'open');

    this.getLogoutButton().click();
  };

  changeLocale = (locale: string) => {
    // hydrate
    this.getLocaleButton().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    this.getLocaleButton().click();
    this.getLocaleSelector().find(`oryx-option[value="${locale}"]`).click();
  };
}
