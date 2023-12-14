import { PickingInProgressModalFragment } from './picking-in-progress-modal.fragment';

export class ListsFragment {
  getWrapper = () => cy.get('oryx-picking-lists');
  getSortButton = () => this.getWrapper().find('oryx-picking-filter-button');
  getNoItemsFallback = () => cy.get('.no-items-fallback');
  getNoItemsFallbackHeading = () =>
    this.getNoItemsFallback().find('oryx-heading');
  getStartSearchingFallbackImage = () =>
    this.getNoItemsFallback().find('oryx-image[resource="searching"]');
  getNoPickingResultsFallbackImage = () =>
    this.getNoItemsFallback().find('oryx-image[resource="no-search-results"]');
  getPickingListsItems = () => this.getWrapper().find('oryx-picking-list-item');
  getCustomerNoteButtons = () =>
    this.getPickingListsItems().find('.total oryx-button');
  getStartPickingButtons = () =>
    this.getPickingListsItems().find('oryx-button[slot="footer"]');
  getPickingListItemId = (eq: number) =>
    this.getPickingListsItems()
      .eq(eq)
      .find('.identifier')
      .should('be.visible')
      .invoke('text');
  getPickingListItemByOrderId = (orderId: string) => {
    return this.getPickingListsItems().contains('.identifier', orderId);
  };
  pickingInProgressModal = new PickingInProgressModalFragment();

  startPickingByEq = (eq: number) => {
    this.getStartPickingButtons().eq(eq).click();
  };
}
