import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();

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
      cy.location('pathname').should('be.equal', '/');
      pickingListsFragment.getWrapper().should('be.visible');
    });
  });
});
