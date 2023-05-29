import { PickingListsFragment } from './picking-lists.fragment';

const pickingListsFragment = new PickingListsFragment();

export class FiltersFragment {
  getFilterButton = () => cy.get('oryx-picking-filter-button');
  getFilterButtonTrigger = () =>
    this.getFilterButton().find('oryx-toggle-icon input');
  getFiltersModal = () =>
    this.getFilterButton().find('oryx-picking-filters').find('oryx-modal');
  getFiltersResetButton = () =>
    this.getFilterButton()
      .find('oryx-picking-filters')
      .find('[slot="navigate-back"] button');
  getFiltersCloseButton = () =>
    this.getFiltersModal().find(
      'header oryx-icon-button button[value="cancel"]'
    );
  getFiltersApply = () =>
    this.getFilterButton()
      .find('oryx-picking-filters')
      .find('oryx-button[slot="footer"] button');
  getSortingOption = (eq: number) =>
    this.getFiltersModal().find('input').eq(eq);
  isPickingListsOrderChanged = (changed = false) =>
    pickingListsFragment
      .getPickingListsItems()
      .eq(0)
      .find('.total oryx-icon-button button')
      .should(!changed ? 'exist' : 'not.exist');
}
