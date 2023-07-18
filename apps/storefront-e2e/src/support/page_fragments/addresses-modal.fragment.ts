import { AddEditAddressFormFragment } from './add-edit-address-form.fragment';
import { AddressesListFragment } from './addresses-list.fragment';

export class AddressesModalFragment {
  private wrapperSelector: string;

  addressesList: AddressesListFragment;

  constructor(selector: string) {
    this.wrapperSelector = selector;
    this.addressesList = new AddressesListFragment('oryx-modal');
  }

  getWrapper = () => cy.get(this.wrapperSelector).find('oryx-modal');
  getAddAddressButton = () =>
    this.getWrapper().find('oryx-user-address-add-button');

  addAddressForm = new AddEditAddressFormFragment('oryx-modal');
  getSelectAddressBtn = () =>
    this.getWrapper().find('oryx-button').contains('button', 'Select');
  getCloseModalBtn = () =>
    this.getWrapper()
      .find('dialog')
      .find('header')
      .find('button[value="cancel"]');

  closeModal = () => {
    this.getCloseModalBtn().click();
  };

  selectAddress = (eq: number) => {
    this.addressesList.getAddressListItem().eq(eq).click();
    this.getSelectAddressBtn().click();
  };

  addAddress = (addressData?) => {
    this.getAddAddressButton().click();

    cy.intercept('/assets/addresses/*.json').as('addressesRequest');
    this.addAddressForm.fillAddressForm(addressData);
    cy.wait('@addressesRequest');

    this.addAddressForm.getSaveAddressBtn().click();
  };

  editCity = (newCity: string, addressEq: number) => {
    this.addressesList
      .getAddressListItem()
      .eq(addressEq)
      .find('button')
      .eq(0)
      .click();

    this.addAddressForm
      .getCityInput()
      .clear({ force: true })
      .type(newCity, { force: true });

    this.addAddressForm.getSaveAddressBtn().click();
  };

  removeAddress = (eq: number) => {
    // click remove icon-button
    this.addressesList.getAddressListItem().eq(eq).find('button').eq(1).click();
    // click remove button in remove address modal
    cy.get('oryx-user-address-remove').find('button').eq(1).click();
  };
}
