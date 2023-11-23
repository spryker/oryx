export class UserProfileFragment {
  getWrapper = () => cy.get('oryx-site-navigation-item[uid="user-profile"]');

  getNotification = () => this.getWrapper().find('oryx-notification');
  getLogOutButton = () => this.getWrapper().find('.logout-button');
  getReceiveDataButton = () => this.getWrapper().find('oryx-button').eq(1);
  getCloseButton = () =>
    cy.get('oryx-site-navigation-item').find('dialog oryx-button');

  openUserMenu = () => {
    this.getWrapper().click();
  };

  logout = () => {
    this.getLogOutButton().click();
  };
}
