export class PickingFragment {
  getWrapper = () => cy.get('oryx-picking');
  getTabs = () => this.getWrapper().find('oryx-tabs');
  getTabsList = () => this.getWrapper().find('oryx-tab');
  getTabCounter = (tab) => tab.find('oryx-chip');
  getProducts = () => this.getWrapper().find('oryx-picking-product-card');
  getAllItemsDonePlaceholder = () =>
    this.getWrapper().findByTestId('picking-complete-placeholder');
  getFinishButton = () =>
    this.getWrapper().findByTestId('picking-complete-finish-button');
}
