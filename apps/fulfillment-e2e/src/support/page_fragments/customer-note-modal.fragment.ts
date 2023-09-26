export class CustomerNoteModalFragment {
  getWrapper = () => cy.get('oryx-picking-customer-note-modal');

  getModal = () => this.getWrapper().find('dialog');
  getCloseButton = () => this.getWrapper().find('oryx-button').eq(0);
}
