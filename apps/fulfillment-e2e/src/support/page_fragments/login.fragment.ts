import { TestUserData } from '../../types/user.type';

export class LoginFragment {
  url = '/';

  getWrapper = () => cy.get('oryx-auth-login');
  getEmailInput = () => this.getWrapper().find('[name="email"]');
  getPasswordInput = () => this.getWrapper().find('[name="password"]');
  getLoginButton = () => this.getWrapper().contains('button', 'Log in');
  getBEValidationError = () => this.getWrapper().find('oryx-notification');
  getLabelSlot = () => this.getWrapper().find('slot[name="label"]');

  login = (user: TestUserData) => {
    this.getEmailInput().focus();
    this.getEmailInput().type(user.email, { delay: 10, force: true });
    this.getPasswordInput().type(user.password, { delay: 10, force: true });
    this.getLoginButton().click();
  };
}
