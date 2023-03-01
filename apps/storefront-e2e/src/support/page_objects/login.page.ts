import { LoginFragment } from '../page_fragments/login.fragment';
import { AbstractSFPage } from './abstract.page';

export class LoginPage extends AbstractSFPage {
  url = '/login';

  waitForLoadedSSR(): void {
    this.loginForm.getWrapper().should('be.visible');
  }

  waitForLoadedSPA(): void {
    this.waitForLoadedSSR();
  }

  loginForm = new LoginFragment();
}
