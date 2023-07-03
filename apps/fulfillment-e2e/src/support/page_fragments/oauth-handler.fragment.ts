export class OauthHandlerFragment {
  getWrapper = () => cy.get('oryx-auth-oauth-handler');
  getLogo = () => this.getWrapper().find('oryx-image[resource="logo"]');
  getTitle = () => this.getWrapper().find('oryx-heading');
  getSpinner = () => this.getWrapper().find('oryx-spinner');
}
