export class PickingListsFragment {
  getWrapper = () => cy.get('oryx-picking-lists');
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
}
