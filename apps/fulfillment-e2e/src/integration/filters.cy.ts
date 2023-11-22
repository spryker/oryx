import { FiltersFragment } from '../support/page_fragments/filters.fragment';

const filtersFragment = new FiltersFragment();

describe('When user interacts with the filters', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    cy.cleanupPickings();

    // create picking #1
    cy.createPicking().then((orderId) => {
      cy.receiveData();
      cy.waitForPickingToAppear(orderId);
    });

    // create picking #2
    cy.createPicking().then((orderId) => {
      cy.receiveData();
      cy.waitForPickingToAppear(orderId);
    });
  });

  describe('And filters is closed', () => {
    // TODO: ????
    // what is being tested here?
    it('should reset unapplied changes', () => {
      //check whether default configuration is applied
      filtersFragment.getFilterButtonTrigger().should('not.be.checked');

      // TODO: ???? methods with boolean flags that change behavior
      filtersFragment.shouldChangePickingListsOrder(false);

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
      filtersFragment.shouldChangePickingListsOrder(false);
    });
  });

  // TODO: ????
  // what is being tested here?
  describe('And filters are applied', () => {
    [
      { option: 'Latest pickup time', shouldChangesTheOrder: true },
      { option: 'Largest order size', shouldChangesTheOrder: false },
      { option: 'Smallest order size', shouldChangesTheOrder: true },
    ].forEach(({ option, shouldChangesTheOrder }, index) => {
      it(`should sort by: ${option}`, () => {
        filtersFragment.getFilterButtonTrigger().click();

        filtersFragment.getSortingOption(index + 1).click();

        filtersFragment.getFiltersApplyButton().click();

        //should close the modal
        filtersFragment.getFiltersModal().should('not.be.visible');

        //should apply sorting order
        filtersFragment.shouldChangePickingListsOrder(shouldChangesTheOrder);

        //should make sort button active
        filtersFragment.getFilterButtonTrigger().should('be.checked');
      });
    });
  });

  // TODO: ????
  // what is being tested here + too many actions for a test?
  describe('And preselected filters are reset', () => {
    it('should restore default sorting configuration', () => {
      filtersFragment.getFilterButtonTrigger().click();

      //preselects second sorting option
      filtersFragment.getSortingOption(1).click();
      filtersFragment.getFiltersApplyButton().click();
      filtersFragment.getFilterButtonTrigger().click();

      filtersFragment.getFiltersResetButton().click();

      //should close the modal
      filtersFragment.getFiltersModal().should('not.be.visible');

      //should not make sort button active
      filtersFragment.getFilterButtonTrigger().should('not.be.checked');

      //should reset the form
      filtersFragment.getSortingOption(0).should('be.checked');

      //should not change the order
      filtersFragment.shouldChangePickingListsOrder(false);
    });
  });
});
