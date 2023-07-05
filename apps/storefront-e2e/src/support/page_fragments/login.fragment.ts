import { TestCustomerData } from '../../types/user.type';

export class LoginFragment {
  getWrapper = () => cy.get('oryx-auth-login');

  getEmailInput = () => this.getWrapper().find('[name="email"]');
  getPasswordInput = () => this.getWrapper().find('[name="password"]');
  getRememberMeCheckbox = () => this.getWrapper().find('[name="rememberme"]');
  getLoginButton = () => this.getWrapper().contains('button', 'Log in');
  getBEValidationError = () => this.getWrapper().find('oryx-notification');

  login = (user: TestCustomerData) => {
    // hydrate the form with a bit of waiting, to avoid flaky tests
    this.getEmailInput().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    this.getEmailInput().type(user.email, { force: true });
    this.getPasswordInput().type(user.password, { force: true });
    this.getRememberMeCheckbox().click();
    this.getLoginButton().click();
  };
}
