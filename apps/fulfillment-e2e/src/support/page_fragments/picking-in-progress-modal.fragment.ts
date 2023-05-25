export class PickingInProgressModalFragment {
  getWrapper = () => cy.get('oryx-picking-in-progress-modal');

  getProceedToPickingBtn = () => cy.contains('Proceed to picking');
  getModal = () => this.getWrapper().find('oryx-modal');
  getCloseButton = () => this.getWrapper().find('button').eq(0);
}
