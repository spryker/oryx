import { LoginFragment } from '../page_fragments/login.fragment';
import { AbstractFAPage } from './abstract.page';

export class LoginPage extends AbstractFAPage {
  url = '/';

  loginForm = new LoginFragment();
  getWrapper = () => cy.get('oryx-picking-login');
  getLogo = () => this.getWrapper().find('oryx-image[resource="logo"]');
  getTitle = () => this.getWrapper().find('oryx-heading');
  getErrorNotification = () =>
    this.getWrapper().find('oryx-notification[type="error"]');
}
