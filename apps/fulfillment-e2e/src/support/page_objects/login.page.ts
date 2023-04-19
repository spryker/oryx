import { LoginFragment } from '../page_fragments/login.fragment';
import { AbstractFAPage } from './abstract.page';

export class LoginPage extends AbstractFAPage {
  url = '/';

  loginForm = new LoginFragment();
}
