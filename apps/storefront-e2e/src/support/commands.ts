import { LoginPage } from './page_objects/login.page';

export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login(user?: { email: string; password: string }): Chainable<void>;
      waitUpdateComplete(element: Cypress.Chainable<JQuery<HTMLElement>>): Chainable<boolean>
    }
  }
}

export const defaultUser = {
  name: 'Sonia',
  email: 'sonia@spryker.com',
  password: 'change123'
};

Cypress.Commands.add('login', (user = defaultUser) => {
  const homePage = new LoginPage();

  homePage.loginForm.login(user);
});

Cypress.Commands.add('waitUpdateComplete', (element) => {
  return element.invoke('prop', 'updateComplete').should('exist')
});
