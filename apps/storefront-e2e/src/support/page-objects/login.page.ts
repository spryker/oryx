import { LoginFragment } from '../page-fragments/login.fragment';
import { AbstractSFPage } from './abstract.page';

export class LoginPage extends AbstractSFPage {
  url = '/login';

  waitForLoaded(): void {
    this.loginForm.getWrapper().should('be.visible');
  }

  loginForm = new LoginFragment();
}
