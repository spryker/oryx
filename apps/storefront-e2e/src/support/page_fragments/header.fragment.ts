export class HeaderFragment {
  getWrapper = () => cy.get('[uid="header"]')

  getUserSummary = () => cy.get('oryx-user-summary');
  getUserSummaryHeading = () => this.getUserSummary().find('oryx-heading');
  getUserSummaryMenu = () => this.getUserSummary().find('oryx-dropdown');
  getOpenUserMenuButton = () => this.getUserSummaryMenu().find('oryx-button').eq(0);
  getLogoutButton = () => this.getUserSummaryMenu().find('oryx-auth-logout');

  getCartSummary = () => cy.get('oryx-cart-summary');
  getCartCount = () => this.getCartSummary().find('mark');

  getLogo = () => this.getWrapper().find('oryx-content-banner').find('a[href="/"]')
  getContactLink = () => this.getWrapper().find('oryx-content-link').find('a');

  logout = () => {
    cy.waitUpdateComplete(this.getOpenUserMenuButton())

    this.getOpenUserMenuButton().click()
    this.getUserSummaryMenu().should('have.attr', 'open')

    this.getLogoutButton().click()
  }
}
