import { LoginFragment } from '../page_fragments/login.fragment';
import { AbstractFAPage } from './abstract.page';

export class LoginPage extends AbstractFAPage {
  // Login pahe has url '/', and any Pick Lists page has url '/', should we rename it?
  url = '/';

  loginForm = new LoginFragment();
  getWrapper = () => cy.get('oryx-login-page');
  getLogo = () => this.getWrapper().find('oryx-image[resource="logo"]');
  getTitle = () => this.getWrapper().find('oryx-heading');
  getErrorNotification = () =>
    this.getWrapper().find('oryx-notification[type="error"]');
}
