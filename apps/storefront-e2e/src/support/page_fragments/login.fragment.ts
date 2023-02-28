export class LoginFragment {
  getWrapper = () => cy.get('oryx-auth-login');

  getEmailInput = () => this.getWrapper().find('[name="username"]');
  getPasswordInput = () => this.getWrapper().find('[name="password"]');
  getRememberMeCheckbox = () => this.getWrapper().find('[name="remember"]');
  getLoginButton = () => this.getWrapper().contains('button', 'Login');
  getBEValidationError = () => this.getWrapper().find('oryx-notification');

  login = (user: { email: string; password: string }) => {
    this.getEmailInput().type(user.email, { delay: 100 });
    this.getPasswordInput().type(user.password, { delay: 100 })
    this.getRememberMeCheckbox().click();
    this.getLoginButton().click();
  };
}
