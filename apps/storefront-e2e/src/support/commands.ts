import { User } from '../types/user.type';
import { LoginPage } from './page_objects/login.page';

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login(user: User): Chainable<void>;
      waitUpdateComplete(element: Cypress.Chainable<JQuery<HTMLElement>>): Chainable<boolean>
    }
  }
}

export const defaultUser: User = {
  name: 'Sonia',
  email: 'sonia@spryker.com',
  password: 'change123'
};

Cypress.Commands.add('login', (user: User) => {
  const homePage = new LoginPage();

  homePage.loginForm.login(user);
});

Cypress.Commands.add('waitUpdateComplete', (element) => {
  return element.invoke('prop', 'updateComplete').should('exist')
});
