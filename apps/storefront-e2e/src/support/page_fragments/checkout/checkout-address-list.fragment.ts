export class CheckoutAddressListFragment {
  private wrapperSelector: string;

  constructor(selector: string) {
    this.wrapperSelector = selector;
  }

  getWrapper = () => cy.get(this.wrapperSelector);
  getAddressList = () => this.getWrapper().find('oryx-address-list');
  getAddressListItem = () => this.getAddressList().find('oryx-address-list-item');
}