import { AddressesListFragment } from '../addresses-list.fragment';
import { CheckoutAddressFormFragment } from './checkout-address-form.fragment';

export class CheckoutAddressModalFragment {
  private wrapperSelector: string;

  addressesList: AddressesListFragment;

  constructor(selector: string) {
    this.wrapperSelector = selector;
    this.addressesList = new AddressesListFragment('oryx-modal');
  }

  getWrapper = () => cy.get(this.wrapperSelector).find('oryx-modal');
  getAddAddressButton = () =>
    this.getWrapper().find('oryx-user-address-add-button');

  addAddressForm = new CheckoutAddressFormFragment('oryx-user-address-edit');
  getSaveAddressBtn = () =>
    this.getWrapper().find('oryx-button').contains('button', 'Save');
  getCloseModalBtn = () =>
    this.getWrapper()
      .find('dialog')
      .find('header')
      .find('button[value="cancel"]');

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
    this.addressesList.getAddressListItem().eq(0).find('button').eq(0).click();
    this.addAddressForm
      .getCompanyInput()
      .clear()
      .type(newCompany, { force: true });
    this.getSaveAddressBtn().click();
  };

  removeAddress = () => {
    // remove icon-button click
    this.addressesList.getAddressListItem().eq(0).find('button').eq(1).click();
    // remove button in remove address modal click
    cy.get('oryx-user-address-remove').find('button').eq(1).click();
  };
}
