export class HeaderFragment {
  getWrapper = () => cy.get('[uid="header"]');

  getContactLink = () => this.getWrapper().find('oryx-content-link').find('a');

  getCurrencySelector = () =>
    this.getWrapper().find('oryx-site-currency-selector');
  getCurrencyButton = () =>
    this.getCurrencySelector().find('oryx-button').find('button');

  getLocaleSelector = () => this.getWrapper().find('oryx-site-locale-selector');
  getLocaleButton = () =>
    this.getLocaleSelector().find('oryx-button').find('button');

  getLogo = () =>
    this.getWrapper().find('oryx-content-image').find('a[href="/"]');

  getUserSummary = () => cy.get('oryx-site-navigation-item:nth-of-type(1)');
  getUserSummaryHeading = () => this.getUserSummary().find('oryx-heading');
  getUserSummaryMenu = () => this.getUserSummary().find('oryx-dropdown');
  getOpenUserMenuButton = () =>
    this.getUserSummaryMenu().find('oryx-button').eq(0);
  getLogoutButton = () =>
    this.getUserSummaryMenu().find('oryx-auth-login-link');

  getCartSummary = () => cy.get('oryx-site-navigation-item:nth-of-type(2)');
  getCartCount = () => this.getCartSummary().find('mark');

  logout = () => {
    this.getOpenUserMenuButton().click();
    this.getUserSummaryMenu().should('have.attr', 'open');

    this.getLogoutButton().click();
  };

  changeLocale = (locale: string) => {
    this.initProductsUpdateInterceptor();

    this.getLocaleButton().trigger('mouseenter').wait(150).click();

    this.getLocaleSelector()
      .find(`oryx-option[value="${locale}"]`)
      .wait(75)
      .click();

    this.waitForProductsUpdate();
  };

  changeCurrency = (currency: string) => {
    this.initProductsUpdateInterceptor();

    this.getCurrencyButton().trigger('mouseenter').wait(150).click();

    this.getCurrencySelector()
      .find(`oryx-option[value="${currency}"]`)
      .wait(75)
      .click();

    this.waitForProductsUpdate();
  };

  private initProductsUpdateInterceptor() {
    cy.intercept({
      method: 'GET',
      url: /\/catalog-search.*|\/concrete-products\/.*/,
    }).as('productOrSearchRequests');
  }

  private waitForProductsUpdate() {
    cy.wait('@productOrSearchRequests');
  }
}
