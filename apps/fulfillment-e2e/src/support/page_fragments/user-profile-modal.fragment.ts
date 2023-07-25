export class UserProfileFragment {
  getWrapper = () => cy.get('oryx-picking-user-profile');

  getNotification = () => this.getWrapper().find('oryx-notification');
  getLogOutButton = () => this.getWrapper().find('oryx-button').eq(0);
  getReceiveDataButton = () => this.getWrapper().find('oryx-button').eq(1);
  getCloseButton = () =>
    cy.get('oryx-site-navigation-item').find('dialog oryx-button');
}
