export class PickingListsFragment {
  private getElement = (selector: string, withoutWrapper?: boolean) => {
    return withoutWrapper ? cy.get(selector) : this.getWrapper().find(selector);
  };

  getWrapper = () => cy.get('oryx-picking-lists');

  getPickingListsItem = () => this.getWrapper().find('oryx-picking-list-item');

  getCustomerNoteButton = () =>
    this.getWrapper().find('oryx-icon-button button');

  getStartPickingButton = () => cy.get('oryx-button button');

  getIdentifier = () =>
    this.getCustomerNoteButton()
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
