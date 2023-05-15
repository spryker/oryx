import { PickingInProgressModalFragment } from './picking-in-progress-modal.fragment';

export class PickingListsFragment {
  getWrapper = () => cy.get('oryx-picking-lists');
  getPickingListsItems = () => this.getWrapper().find('oryx-picking-list-item');
  getCustomerNoteButtons = () =>
    this.getPickingListsItems().find('oryx-icon-button button');
  getStartPickingButtons = () =>
    this.getPickingListsItems().find('oryx-button button');
  getPickingListItemId = (eq: number) =>
    this.getPickingListsItems()
      .eq(eq)
      .find('.identifier')
      .should('be.visible')
      .invoke('text');
  pickingInProgressModal = new PickingInProgressModalFragment();
}
