import { FiltersFragment } from '../support/page_fragments/filters.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();
const filtersFragment = new FiltersFragment();

describe('When user interacts with filters', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
  });

  describe('and user clicks on the filters button', () => {
    beforeEach(() => {
      filtersFragment.getFilterButtonTrigger().click();
    });

    it('should show the filters modal', () => {
      filtersFragment.getFiltersModal().should('be.visible');
    });

    it('should have default selected sorting option', () => {
      filtersFragment.getFiltersModal().find('input').eq(0).invoke('attr', 'checked').should('be.true');
    });

    describe('and user clicks on the filters button', () => {
      beforeEach(() => {
        filtersFragment.getFilterButtonTrigger().click();
      });
  
      it('should show the filters modal', () => {
        filtersFragment.getFiltersModal().should('be.visible');
      });
    });
  });
});
