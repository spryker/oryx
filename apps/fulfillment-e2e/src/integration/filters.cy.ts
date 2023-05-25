import { FiltersFragment } from '../support/page_fragments/filters.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();
const filtersFragment = new FiltersFragment();

describe('When user opens the filters', () => {
  const largeAndEarliestOrderFirst = (exists = true) =>
    pickingListsFragment
      .getPickingListsItems()
      .eq(0)
      .find('.total oryx-icon-button button')
      .should(exists ? 'exist' : 'not.exist');

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();

    filtersFragment.getFilterButtonTrigger().click();
  });

  it('should apply correct sorting configuration', () => {
    //should open the filters modal
    filtersFragment.getFiltersModal().should('have.attr', 'open');
    //should have default selected sorting option
    filtersFragment.getFiltersModal().find('input').eq(0).should('be.checked');

    //When close button is clicked
    filtersFragment.getFiltersModal().find('input').eq(1).click();
    filtersFragment.getFiltersModal().find('input').eq(1).should('be.checked');

    filtersFragment.getFiltersClose().click();

    //should close the modal
    filtersFragment.getFiltersModal().should('not.have.attr', 'open');

    //should not make sort button active
    filtersFragment.getFilterButtonTrigger().should('not.be.checked');

    //should reset the form
    filtersFragment.getFiltersModal().find('input').eq(0).should('be.checked');

    //should not change the order
    largeAndEarliestOrderFirst();

    //When sorting is applied
    [false, true, false].forEach((expect, index) => {
      filtersFragment.getFilterButtonTrigger().click();

      filtersFragment
        .getFiltersModal()
        .find('input')
        .eq(index + 1)
        .click();
      filtersFragment.getFiltersApply().click();

      //should close the modal
      filtersFragment.getFiltersModal().should('not.have.attr', 'open');

      //should apply sorting order
      largeAndEarliestOrderFirst(expect);

      //should make sort button active
      filtersFragment.getFilterButtonTrigger().should('be.checked');
    });

    //And filters are reset
    filtersFragment.getFilterButtonTrigger().click();
    filtersFragment.getFiltersReset().click();

    //should close the modal
    filtersFragment.getFiltersModal().should('not.have.attr', 'open');

    //should not make sort button active
    filtersFragment.getFilterButtonTrigger().should('not.be.checked');

    //should reset the form
    filtersFragment.getFiltersModal().find('input').eq(0).should('be.checked');

    //should not change the order
    largeAndEarliestOrderFirst();
  });
});
