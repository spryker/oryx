import { TestUserData } from '../../types/user.type';

export class LoginFragment {
  getWrapper = () => cy.get('oryx-auth-login');

  getEmailInput = () => this.getWrapper().find('[name="email"]');
  getPasswordInput = () => this.getWrapper().find('[name="password"]');
  getRememberMeCheckbox = () => this.getWrapper().find('[name="rememberme"]');
  getLoginButton = () => this.getWrapper().contains('button', 'Login');
  getBEValidationError = () => this.getWrapper().find('oryx-notification');

  login = (user: TestUserData) => {
    this.getEmailInput().type(user.email);
    this.getPasswordInput().type(user.password);
    this.getRememberMeCheckbox().click();
    this.getLoginButton().click();
  };
}
