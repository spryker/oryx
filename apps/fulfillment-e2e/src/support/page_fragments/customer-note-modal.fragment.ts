export class CustomerNoteModalFragment {
  getWrapper = () => cy.get('oryx-customer-note-modal');

  getModal = () => this.getWrapper().find('dialog');
  getCloseButton = () => this.getWrapper().find('oryx-button').eq(0);
}
