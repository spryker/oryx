import { TestUserData } from '../types/user.type';
import { LoginPage } from './page_objects/login.page';
import { SCCOSApi } from './sccos_api/sccos.api';

export { };

declare global {
  namespace Cypress {
    interface Chainable {
      login(user: TestUserData): Chainable<void>;
      waitUpdateComplete(
        element: Cypress.Chainable<JQuery<HTMLElement>>
      ): Chainable<boolean>;
      customerCartsCleanup(sccosApi: SCCOSApi, user: TestUserData): void;
      customerAddressesCleanup(sccosApi: SCCOSApi, user: TestUserData): void;
      disableAnimations(): void
    }
  }
}

export const defaultUser: TestUserData = {
  id: 'DE--1',
  name: 'Spencor',
  email: 'spencor.hopkin@spryker.com',
  password: 'change123',
};

Cypress.Commands.add('login', (user: TestUserData) => {
  const loginPage = new LoginPage();

  loginPage.visit();
  loginPage.loginForm.login(user);

  loginPage.header.getUserSummaryHeading().should('contain', user.name);
});

Cypress.Commands.add('waitUpdateComplete', (element) => {
  return element.invoke('prop', 'updateComplete').should('exist');
});

Cypress.Commands.add(
  'customerCartsCleanup',
  (sccosApi: SCCOSApi, user: TestUserData) => {
    sccosApi.carts.customersGet(user.id).then((response) => {
      const carts = response.body.data;

      // remove last cart id from the list
      // because it can't be deleted
      carts.pop();

      carts.map((cart) => cart.id).forEach((id) => sccosApi.carts.delete(id));
    });

    // create new, empty cart
    sccosApi.carts.post();
  }
);

Cypress.Commands.add(
  'customerAddressesCleanup',
  (sccosApi: SCCOSApi, user: TestUserData) => {
    sccosApi.addresses.get(user.id).then((response) => {
      const addresses = response.body.data;

      addresses
        .map((address) => address.id)
        .forEach((id) => sccosApi.addresses.delete(user.id, id));
    });
  }
);

Cypress.Commands.add('disableAnimations', () => {
  cy.window().then(window => {
    const document = window.document
    const root = document.querySelector('root-app') as any

    root.style.setProperty('--oryx-transition-time', 0);
    root.style.setProperty('--oryx-transition-time-medium', 0);
    root.style.setProperty('--oryx-transition-time-long', 0);
  })
})
