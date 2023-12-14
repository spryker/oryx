import { AFAPage } from './abstract-fa.page';

export class LoadingPage extends AFAPage {
  url = '/oauth';

  getWrapper = () => cy.get('oryx-auth-oauth-handler');
  getLogo = () => this.getWrapper().find('oryx-image[resource="logo"]');
  getTitle = () => this.getWrapper().find('oryx-heading');
  getSpinner = () => this.getWrapper().find('oryx-spinner');
}
