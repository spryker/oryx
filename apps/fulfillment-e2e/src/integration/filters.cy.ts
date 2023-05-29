import { FiltersFragment } from '../support/page_fragments/filters.fragment';

const filtersFragment = new FiltersFragment();

describe('When user interacts with the filters', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
  });

  describe('And filters is closed', () => {
    it('should reset unapplied changes', () => {
      //check whether default configuration is applied
      filtersFragment.getFilterButtonTrigger().should('not.be.checked');
      filtersFragment.isPickingListsOrderChanged();

      filtersFragment.getFilterButtonTrigger().click();

      //should open the filters modal
      filtersFragment.getFiltersModal().should('be.visible');
      //should have default selected sorting option
      filtersFragment.getSortingOption(0).should('be.checked');

      //When close button is clicked
      filtersFragment.getSortingOption(1).click();
      filtersFragment.getSortingOption(1).should('be.checked');

      filtersFragment.getFiltersCloseButton().click();

      //should close the modal
      filtersFragment.getFiltersModal().should('not.be.visible');

      //should not make sort button active
      filtersFragment.getFilterButtonTrigger().should('not.be.checked');

      //should reset the form
      filtersFragment.getSortingOption(0).should('be.checked');

      //should not change the order
      filtersFragment.isPickingListsOrderChanged();
    });
  });

  describe('And filters are applied', () => {
    it('should apply correct sorting configuration', () => {
      [
        true, //should change the picking list's order
        false, //should not change the picking list's order
        true, //should change the picking list's order
      ].forEach((isChanged, index) => {
        filtersFragment.getFilterButtonTrigger().click();

        filtersFragment.getSortingOption(index + 1).click();

        filtersFragment.getFiltersApply().click();

        //should close the modal
        filtersFragment.getFiltersModal().should('be.visible');

        //should apply sorting order
        filtersFragment.isPickingListsOrderChanged(isChanged);

        //should make sort button active
        filtersFragment.getFilterButtonTrigger().should('be.checked');
      });
    });
  });

  describe('And preselected filters are reset', () => {
    it('should restore default sorting configuration', () => {
      filtersFragment.getFilterButtonTrigger().click();

      //preselects second sorting option
      filtersFragment.getSortingOption(1).click();
      filtersFragment.getFiltersApply().click();
      filtersFragment.getFilterButtonTrigger().click();

      filtersFragment.getFiltersResetButton().click();

      //should close the modal
      filtersFragment.getFiltersModal().should('.not.be.visible');

      //should not make sort button active
      filtersFragment.getFilterButtonTrigger().should('not.be.checked');

      //should reset the form
      filtersFragment.getSortingOption(0).should('be.checked');

      //should not change the order
      filtersFragment.isPickingListsOrderChanged();
    });
  });
});
