export class CustomerNoteFragment {
  getWrapper = () => cy.get('oryx-modal');

  getModal = () => this.getWrapper().find('dialog');
  getCloseButton = () => this.getWrapper().find('button').eq(0);
}
