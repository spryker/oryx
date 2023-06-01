import { CheckoutAddressFormFragment } from './checkout-address-form.fragment';

export class CheckoutAddressModalFragment {
  private wrapperSelector: string;

  constructor(selector: string) {
    this.wrapperSelector = selector;
  }

  getWrapper = () => cy.get(this.wrapperSelector);
  getAddAddressButton = () => this.getWrapper().find('oryx-button');
  getAddressList = () => this.getWrapper().find('oryx-user-address-list');
  getAddressListItem = () =>
    this.getAddressList().find('oryx-user-address-list-item');

  addAddressForm = new CheckoutAddressFormFragment();
  getSaveAddressBtn = () =>
    this.getWrapper().find('oryx-button').contains('button', 'Save');
  getCloseModalBtn = () =>
    this.getWrapper().find('dialog').find('button[value="cancel"]');

  closeModal = () => {
    this.getCloseModalBtn().click();
  };

  addAddress = () => {
    this.getAddAddressButton().click();
    this.addAddressForm.fillAddressForm();
    this.getSaveAddressBtn().click();
  };

  editCompanyInAddress = (newCompany: string) => {
    // edit icon-button click
    this.getAddressListItem().eq(0).find('button').eq(0).click();
    this.addAddressForm
      .getCompanyInput()
      .clear()
      .type(newCompany, { force: true });
    this.getSaveAddressBtn().click();
  };

  removeAddress = () => {
    // remove icon-button click
    this.getAddressListItem().eq(0).find('button').eq(1).click();
    // remove button in remove address modal click
    cy.get('oryx-user-address-remove').find('button').eq(1).click();
  };
}
