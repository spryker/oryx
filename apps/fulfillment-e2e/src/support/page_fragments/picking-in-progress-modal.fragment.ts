export class PickingInProgressModalFragment {
  getWrapper = () => cy.get('oryx-picking-in-progress-modal');
  getModal = () => this.getWrapper().find('oryx-modal');
  getCloseButton = () => this.getWrapper().find('oryx-button').eq(0);
  getOverlay = () => this.getModal().find('dialog');
}
