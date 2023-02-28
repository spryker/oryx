import { LoginFragment } from '../page_fragments/login.fragment';
import { AbstractSFPage } from './abstract.page';

export class LoginPage extends AbstractSFPage {
  url = '/login';

  waitForLoaded(): void {
    this.loginForm.getWrapper().should('be.visible').click()
    cy.waitUpdateComplete(this.loginForm.getWrapper()).should('be.true')
  }

  loginForm = new LoginFragment();
}
