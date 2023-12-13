export class UserProfileModal {
  getWrapper = () => cy.get('oryx-picking-user-profile');

  getNotification = () => this.getWrapper().find('oryx-notification');
  getLogOutButton = () => this.getWrapper().find('.logout-button');
  getSyncDataButton = () => this.getWrapper().find('.sync-data');
  getCloseButton = () =>
    cy.get('oryx-site-navigation-item').find('dialog oryx-button');

  logout = () => this.getLogOutButton().click();
}
