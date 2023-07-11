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
    cy.intercept({
      method: 'GET',
      url: /(\/catalog-search.*|\/concrete-products\/.*)/,
    }).as('productOrSearchRequests');
    // hydrate
    this.getLocaleButton().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    this.getLocaleButton().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    this.getLocaleSelector()
      .find(`oryx-option[value="${locale}"]`)
      .click({ force: true });
    cy.wait('@productOrSearchRequests');
  };

  changeCurrency = (currency: string) => {
    // hydrate
    this.getCurrencyButton().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    this.getCurrencyButton().click();
    this.getCurrencySelector()
      .find(`oryx-option[value="${currency}"]`)
      .click({ force: true });
  };
}
