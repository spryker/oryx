import { ListsFragment } from './lists.fragment';

const listsFragment = new ListsFragment();

export class FiltersFragment {
  getFilterButton = () => cy.get('oryx-picking-filter-button');
  getFilterButtonTrigger = () =>
    this.getFilterButton().find('oryx-toggle-icon input');
  getFiltersModal = () =>
    this.getFilterButton().find('oryx-picking-filters').find('oryx-modal');
  getFiltersResetButton = () =>
    this.getFilterButton()
      .find('oryx-picking-filters')
      .find('[slot="navigate-back"]');
  getFiltersCloseButton = () =>
    this.getFiltersModal().find('header oryx-button').eq(1);
  getFiltersApplyButton = () =>
    this.getFilterButton()
      .find('oryx-picking-filters')
      .find('oryx-button[slot="footer"]');
  getSortingOption = (eq: number) =>
    this.getFiltersModal().find('input').eq(eq);
  shouldChangePickingListsOrder = (isChange: boolean) =>
    listsFragment
      .getPickingListsItems()
      .eq(0)
      .find('.total oryx-button')
      .should(!isChange ? 'exist' : 'not.exist');
}
