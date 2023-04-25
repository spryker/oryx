import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { LoginPage } from '../support/page_objects/login.page';

const pickingListsFragment = new PickingListsFragment();
const loginPage = new LoginPage();

describe('Login Suite', () => {
  describe('when logged out', () => {
    it('should redirect to login page', () => {
      cy.visit('/');

      cy.location('pathname').should('to.match', /^\/login/);
    });
  });
  describe('when logging in', () => {
    it('should login successfully', () => {
      let isLoadingPage = false;

      cy.on('url:changed', (newurl) => {
        isLoadingPage = newurl.includes('oauth') ? true : isLoadingPage;
      });

      cy.login();
      cy.then(() => expect(isLoadingPage).to.be.true);
      pickingListsFragment.getPickingListsItem().should('have.length', 2);
      pickingListsFragment.getWrapper().should('be.visible');
    });
  });
});
