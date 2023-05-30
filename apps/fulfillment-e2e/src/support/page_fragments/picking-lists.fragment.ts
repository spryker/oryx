import { PickingInProgressModalFragment } from './picking-in-progress-modal.fragment';

export class PickingListsFragment {
  getWrapper = () => cy.get('oryx-picking-lists');
  getHeadline = () => cy.get('oryx-picking-lists-header').find('oryx-heading');
  getSearch = () => cy.get('oryx-search');
  getSearchIcon = () => this.getSearch().find('oryx-icon[type="search"]');
  getSearchInput = () => this.getSearch().find('input[placeholder="Order ID"]');
  getSearchBackButton = () => this.getSearch().find('.back-button');
  getSearchClearButton = () => this.getSearch().find('.clear-button');
  getUserIcon = () => cy.get('oryx-site-navigation-item');
  getSortButton = () => this.getWrapper().find('oryx-picking-filter-button');
  getNoItemsFallback = () => cy.get('.no-items-fallback');
  getNoItemsFallbackHeading = () =>
    this.getNoItemsFallback().find('oryx-heading');
  getNoItemsFallbackImage = () => this.getNoItemsFallback().find('oryx-image');
  getPickingListsItems = () => this.getWrapper().find('oryx-picking-list-item');
  getCustomerNoteButtons = () =>
    this.getPickingListsItems().find('.total oryx-icon-button button');
  getStartPickingButtons = () =>
    this.getPickingListsItems().find('oryx-button[slot="footer"] button');
  getPickingListItemId = (eq: number) =>
    this.getPickingListsItems()
      .eq(eq)
      .find('.identifier')
      .should('be.visible')
      .invoke('text');
  pickingInProgressModal = new PickingInProgressModalFragment();
}
