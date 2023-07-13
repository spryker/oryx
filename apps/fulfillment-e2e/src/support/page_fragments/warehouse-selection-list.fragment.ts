export class WarehouseSelectionListFragment {
  getWrapper = () => cy.get('.warehouses-list');
  getTitle = () => this.getWrapper().find('oryx-heading h1');
  getWarehouseNames = () => this.getWrapper().find('oryx-heading h3');
  getWarehouseSelectionButtons = () => this.getWrapper().find('button');
}
