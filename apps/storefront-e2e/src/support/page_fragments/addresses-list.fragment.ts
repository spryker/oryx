export class AddressesListFragment {
  private wrapperSelector: string;

  constructor(selector: string) {
    this.wrapperSelector = selector;
  }

  getWrapper = () => cy.get(this.wrapperSelector);
  getChangeAddressesButton = () =>
    this.getWrapper().find('oryx-checkout-manage-address');
  getMultiLineAddress = () => this.getWrapper().find('oryx-user-address');
  getAddressList = () => this.getWrapper().find('oryx-user-address-list');
  getAddressListItem = () =>
    this.getAddressList().find('oryx-user-address-list-item');
}
