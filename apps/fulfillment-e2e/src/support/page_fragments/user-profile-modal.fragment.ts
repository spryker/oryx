export class UserProfileModal {
  getWrapper = () => cy.get('oryx-site-navigation-item[uid="user-profile"]');

  getNotification = () => this.getWrapper().find('oryx-notification');
  getLogOutButton = () => this.getWrapper().find('.logout-button');
  getReceiveDataButton = () => this.getWrapper().find('.receive-data');
  getCloseButton = () =>
    cy.get('oryx-site-navigation-item').find('dialog oryx-button');

  logout = () => this.getLogOutButton().click();
}
