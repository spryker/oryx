export class PickingListsFragment {
  private getElement = (selector: string, withoutWrapper?: boolean) => {
    return withoutWrapper ? cy.get(selector) : this.getWrapper().find(selector);
  };

  getWrapper = () => cy.get('oryx-picking-lists');
  getPickingListsItem = () => this.getWrapper().find('oryx-picking-list-item');
  getCustomerNoteButton = () =>
    this.getWrapper().find('oryx-icon-button button');
  getStartPickingButton = (withoutWrapper?: boolean) =>
    this.getElement('oryx-button button', withoutWrapper);
  getIdentifier = (withoutWrapper?: boolean) =>
    this.getElement('.identifier', withoutWrapper);
}
