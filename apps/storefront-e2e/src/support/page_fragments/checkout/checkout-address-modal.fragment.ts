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

  editCompanyInAddress = (newCompany: string) => {
    this.getAddressListItem().eq(0).find('button').eq(0).click();
    this.addAddressForm.getCompanyInput().clear().type(newCompany, { force: true });
    this.getSaveAddressBtn().click();
  }
}