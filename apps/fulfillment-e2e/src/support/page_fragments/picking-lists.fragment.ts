export class PickingListsFragment {
  getWrapper = () => cy.get('oryx-picking-lists');
  getPickingListsItems = () => this.getWrapper().find('oryx-picking-list-item');
  getCustomerNoteButtons = () =>
    this.getPickingListsItems().find('oryx-icon-button button');
  getStartPickingButtons = () =>
    this.getPickingListsItems().find('oryx-button button');
  getIdentifier = () =>
    this.getCustomerNoteButtons()
      .parents('oryx-picking-list-item')
      .within(() => {
        return cy
          .get('.identifier')
          .invoke('text')
          .then((identifierText) => {
            cy.wrap(identifierText).as('identifier');
          });
      });
}
