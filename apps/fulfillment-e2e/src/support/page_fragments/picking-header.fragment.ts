export class PickingHeaderFragment {
  getWrapper = () => cy.get('oryx-picking-header');

  getCustomerNoteIcon = () =>
    this.getWrapper().find('button[aria-label="Customer note"]');
  getUserIcon = () => this.getWrapper().find('oryx-site-navigation-item');
  getPickingListsTitle = () => this.getWrapper().find('.title');
  getBackButton = () => this.getWrapper().find('oryx-icon-button').eq(0);
}
