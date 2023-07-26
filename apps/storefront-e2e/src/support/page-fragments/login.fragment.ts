import { Customer } from '../types/user.type';

export class LoginFragment {
  getWrapper = () => cy.get('oryx-auth-login');

  getEmailInput = () => this.getWrapper().find('[name="email"]');
  getPasswordInput = () => this.getWrapper().find('[name="password"]');
  getRememberMeCheckbox = () => this.getWrapper().find('[name="rememberme"]');
  getLoginButton = () => this.getWrapper().contains('button', 'Log in');
  getBEValidationError = () => this.getWrapper().find('oryx-notification');

  login = (user: Customer) => {
    cy.hydrateElemenet('/assets/checkbox.component-*.js', () => {
      this.getEmailInput().click();
    });

    // password input is disabled sometimes for no reason
    this.getEmailInput().type(user.email, { force: true });
    this.getPasswordInput().type(user.password, { force: true });
    this.getRememberMeCheckbox().click();
    this.getLoginButton().click();
  };
}
