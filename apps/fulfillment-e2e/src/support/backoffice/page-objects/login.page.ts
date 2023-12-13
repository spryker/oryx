import { ABackofficePage } from './abstract-backoffice.page';

export class LoginPage extends ABackofficePage {
  url = '/security-gui/login';

  getEmailInput = () => cy.get('#auth_username');
  getPasswordInput = () => cy.get('#auth_password');
  getSubmitBtn = () => cy.contains('.btn', 'Login');

  login = (email: string, password: string) => {
    // IDK why this is needed but login works only after reload
    cy.reload();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    this.getEmailInput().type(email);
    this.getPasswordInput().type(password);
    this.getSubmitBtn().click();
  };
}
