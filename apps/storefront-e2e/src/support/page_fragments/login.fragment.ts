import { TestUserData } from '../../types/user.type';

export class LoginFragment {
  getWrapper = () => cy.get('oryx-auth-login');

  getEmailInput = () => this.getWrapper().find('[name="email"]');
  getPasswordInput = () => this.getWrapper().find('[name="password"]');
  getRememberMeCheckbox = () => this.getWrapper().find('[name="rememberme"]');
  getLoginButton = () => this.getWrapper().contains('button', 'Login');
  getBEValidationError = () => this.getWrapper().find('oryx-notification');

  login = (user: TestUserData) => {
    this.getEmailInput().focus();
    // there is no other way to detect that hydration is finished
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);

    this.getEmailInput().type(user.email, { delay: 100, force: true });
    this.getPasswordInput().type(user.password, { delay: 100, force: true });
    this.getRememberMeCheckbox().click();
    this.getLoginButton().click();
  };
}
