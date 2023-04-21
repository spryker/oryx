import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();

describe('Login Suite', () => {
  it('should login successfully', () => {
    cy.login();

    pickingListsFragment.getWrapper().should('be.visible');
  });
});
