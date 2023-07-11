export class DiscardModalFragment {
  getWrapper = () => cy.get('oryx-discard-picking');
  getContent = () => this.getWrapper().shadow().find('slot[part="body"]');
  getCancelButton = () => this.getWrapper().find('oryx-button').eq(0);
  getDiscardButton = () => this.getWrapper().find('oryx-button').eq(1);
}
