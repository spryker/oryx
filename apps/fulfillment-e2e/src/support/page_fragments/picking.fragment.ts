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
    this.getPartialPickingDialog().find('button').contains('Confirm');
  getPartialPickingCancelButton = () =>
    this.getPartialPickingDialog().find('button').contains('Cancel');
  getPickingCompleteImage = () =>
    cy
      .get('.fallback oryx-image[resource="picking-items-processed"]')
      .shadow()
      .find('svg');
  getPickingCompleteTitle = () => cy.get('.fallback h1');
  getPickingCompleteText = () => cy.get('.fallback span');
  getNoItemsTitle = () => cy.get('.fallback h2');
  getNoItemsImage = () => cy.get('.fallback oryx-image[resource="no-orders"]');
  getFinishPickingButton = () => cy.get('.submit-wrapper oryx-button button');
}
