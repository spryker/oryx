import { CheckoutAddressFormFragment } from "./checkout-address-form.fragment";

export class CheckoutAddressModalFragment {
  private wrapperSelector: string;

  constructor(selector: string) {
    this.wrapperSelector = selector;
  }

  getWrapper = () => cy.get(this.wrapperSelector);
  getAddAddressButton = () => this.getWrapper().find('oryx-button');
  getAddressList = () => this.getWrapper().find('oryx-address-list');
  getAddressListItem = () => this.getAddressList().find('oryx-address-list-item');

  addAddressForm = new CheckoutAddressFormFragment();
  getSaveAddressBtn = () => this.getWrapper().find('oryx-button').contains('button', 'Save');
  getCloseModalBtn = () => this.getWrapper().find('dialog').find('button[value="cancel"]');

  closeModal = () => {
    this.getCloseModalBtn().click();
  }

  addAddress = () => {
    this.getAddAddressButton().click();
    this.addAddressForm.fillAddressForm();
    this.getSaveAddressBtn().click();
  }
}