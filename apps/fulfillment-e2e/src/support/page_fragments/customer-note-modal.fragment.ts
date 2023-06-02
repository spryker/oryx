export class CustomerNoteModalFragment {
  getWrapper = () => cy.get('oryx-customer-note-modal');

  getModal = () => this.getWrapper().find('dialog');
  getCloseButton = () => this.getWrapper().find('button').eq(0);
}
