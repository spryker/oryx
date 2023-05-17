import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();

describe('Picking Lists Search', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    pickingListsFragment.getSearch().click();
  });

  it('should check success search flow', () => {
    pickingListsFragment.getWrapper().should('be.visible');
    pickingListsFragment.getNoItemsFallback().should('be.visible');
    pickingListsFragment
      .getNoItemsFallbackHeading()
      .should('contain.text', 'Search by order ID');
    pickingListsFragment
      .getSearchInput()
      .should('have.attr', 'placeholder')
      .then((placeholderText) => {
        expect(placeholderText).to.contain('Order ID');
      });

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
