import { TestUserData } from '../../types/user.type';
import { LoginFragment } from '../page_fragments/login.fragment';
import { AFAPage } from './abstract-fa.page';

export class LoginPage extends AFAPage {
  url = '/';

  loginForm = new LoginFragment();

  getWrapper = () => cy.get('oryx-picking-login');
  getLogo = () => this.getWrapper().find('oryx-image[resource="logo"]');
  getTitle = () => this.getWrapper().find('oryx-heading');
  getErrorNotification = () =>
    this.getWrapper().find('oryx-notification[type="error"]');

  login = (user: TestUserData) => {
    cy.intercept('POST', '**/token').as('token');
    this.loginForm.login(user);
    cy.wait('@token', { timeout: 30000 });
  };
}
