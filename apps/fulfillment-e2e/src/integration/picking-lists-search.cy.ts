import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();

describe('Picking Lists Search', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    pickingListsFragment.getSearch().click();
  });

  it('should show correct picking items after search', () => {
    pickingListsFragment.getWrapper().should('be.visible');
    pickingListsFragment.getNoItemsFallback().should('be.visible');
    pickingListsFragment.getNoItemsFallbackHeading().should('be.visible');
    pickingListsFragment
      .getSearchInput()
      .should('be.visible')
      .should('have.attr', 'placeholder');

    pickingListsFragment.getSearchInput().type('DE', { force: true });
    pickingListsFragment
      .getPickingListsItems()
      .should('have.length.at.least', 1);

    pickingListsFragment.getSearchClearButton().click();
    pickingListsFragment
      .getNoItemsFallbackHeading()
      .should('contain.text', 'Search by order ID');
  });

  it('should get back to initial picking lists page after click on back', () => {
    pickingListsFragment.getSearchBackButton().click();

    pickingListsFragment.getNoItemsFallback().should('not.exist');
    pickingListsFragment
      .getPickingListsItems()
      .should('have.length.at.least', 1);
  });

  it('should present specific message and image when no results are found', () => {
    pickingListsFragment.getWrapper().should('be.visible');

    pickingListsFragment.getSearchInput().type('1234567', { force: true });
    pickingListsFragment
      .getNoItemsFallbackHeading()
      .should('contain.text', 'No picking results');

    pickingListsFragment
      .getNoItemsFallbackImage()
      .should('be.visible')
      .and('have.attr', 'resource', 'no-search-results');
  });
});
