export class PickingListsFragment {
  getWrapper = () => cy.get('oryx-picking-lists');

  getPickingListsItem = () => this.getWrapper().find('oryx-picking-list-item');

  getCustomerNoteButton = () =>
    this.getWrapper().find('oryx-icon-button button');

  getStartPickingButton = () => cy.get('oryx-button button');
}
