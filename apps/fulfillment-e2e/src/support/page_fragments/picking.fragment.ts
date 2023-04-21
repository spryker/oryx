export class PickingFragment {
  getWrapper = () => cy.get('oryx-picking');
  getTabs = () => this.getWrapper().find('oryx-tabs');
  getTabsList = () => this.getWrapper().find('oryx-tab');
  getTab = (id) => this.getWrapper().find(`oryx-tab[for="${id}"]`);
  getTabCounter = (tab) => tab.find('oryx-chip');
  getProducts = () => this.getWrapper().find('oryx-picking-product-card');
  getTabContent = (tabId) => this.getWrapper().find(`[id="${tabId}"]`);

  getPartialPickingDialog = () => this.getWrapper().find('oryx-modal');
  getPartialPickingConfirmButton = () =>
    this.getPartialPickingDialog().find('button').contains('Confirm');
  getPartialPickingCancelButton = () =>
    this.getPartialPickingDialog().find('button').contains('Cancel');

  getPickingCompleteImage = () =>
    cy.get('.picking-complete oryx-image').shadow().find('svg');
  getPickingCompleteTitle = () => cy.get('.picking-complete h3');
  getPickingCompleteText = () => cy.get('.picking-complete p');

  getFinishPickingButton = () => cy.get('.submit-wrapper oryx-button button');
}
