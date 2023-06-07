export class PickingHeaderFragment {
  getWrapper = () => cy.get('oryx-picking-header');

  getCustomerNoteIcon = () =>
    this.getWrapper().find('button[aria-label="Customer note"]');
  getUserIcon = () => this.getWrapper().find('oryx-site-navigation-item');
  getUserProfileModal = () =>
    this.getUserIcon().find('oryx-modal').shadow().find('dialog');
  getUserProfileModalCloseButton = () =>
    this.getUserProfileModal().find('button[value="cancel"]');
  getPickingListsTitle = () => this.getWrapper().find('.title');
}
