export class PickingInProgressModalFragment {
  getWrapper = () => cy.get('oryx-picking-in-progress-modal');

  getModal = () => this.getWrapper().find('oryx-modal');
  getCloseButton = () => this.getWrapper().find('button').eq(0);
}
