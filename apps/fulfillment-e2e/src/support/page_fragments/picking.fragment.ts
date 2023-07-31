export class PickingFragment {
  getWrapper = () => cy.get('oryx-picking');
  getTabs = () => this.getWrapper().find('oryx-tabs');
  getTabsList = () => this.getWrapper().find('oryx-tab');
  getTabById = (id) => this.getWrapper().find(`oryx-tab[for="${id}"]`);
  getTabCounter = (tab) => tab.find('oryx-chip');
  getProducts = () => this.getWrapper().find('oryx-picking-product-card');
  getTabContentById = (tabId) => this.getWrapper().find(`[id="${tabId}"]`);
  getPartialPickingDialog = () => this.getWrapper().find('oryx-modal');
  getPartialPickingConfirmButton = () =>
    this.getPartialPickingDialog().find('oryx-button').contains('Confirm');
  getPartialPickingCancelButton = () =>
    this.getPartialPickingDialog().find('oryx-button').contains('Cancel');
  getPickingCompleteImage = () =>
    cy
      .get('section oryx-image[resource="picking-items-processed"]')
      .shadow()
      .find('svg');
  getPickingCompleteTitle = () => cy.get('section h1');
  getPickingCompleteText = () => cy.get('section span');
  getNoItemsTitle = () => cy.get('section h2');
  getNoItemsImage = () => cy.get('section oryx-image[resource="no-orders"]');
  getFinishPickingButton = () => cy.get('.submit-wrapper oryx-button');
}
