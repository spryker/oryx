import { defaultAddress } from '../../test-data/default-address';

export class AddEditAddressFormFragment {
  private wrapperSelector: string;

  constructor(selector: string) {
    this.wrapperSelector = selector;
  }

  getWrapper = () => cy.get(this.wrapperSelector);
  getAddressForm = () => this.getWrapper().find('oryx-user-address-form');
  getCountrySelect = () =>
    this.getWrapper().find('oryx-select[label="country"]');
  getSalutationSelect = () =>
    this.getWrapper().find('oryx-select[label="salutation"]');
  getFirstNameInput = () =>
    this.getAddressForm().find('input[name="firstName"]');
  getLastNameInput = () => this.getAddressForm().find('input[name="lastName"]');
  getCompanyInput = () => this.getWrapper().find('input[name="company"]');
  getAddress1Input = () => this.getWrapper().find('input[name="address1"]');
  getAddress2Input = () => this.getWrapper().find('input[name="address2"]');
  getZipInput = () => this.getWrapper().find('input[name="zipCode"]');
  getCityInput = () => this.getWrapper().find('input[name="city"]');
  getPhoneInput = () => this.getWrapper().find('input[name="phone"]');

  getSaveAddressBtn = () =>
    this.getWrapper().find('oryx-button').contains('button', 'Save');

  selectCoutry = (isoCode: string) => {
    this.getCountrySelect().click();
    this.getCountrySelect().find(`oryx-option[value="${isoCode}"]`).click();
  };

  selectSalutation = (salutation: string) => {
    this.getSalutationSelect().click();
    this.getSalutationSelect().contains('oryx-option', salutation).click();
  };

  fillAddressForm = (addressData?) => {
    const address = { ...defaultAddress, ...addressData };

    this.selectCoutry(address.iso2Code);
    this.selectSalutation(address.salutation);
    this.getFirstNameInput()
      .clear({ force: true })
      .type(address.firstName, { force: true });
    this.getLastNameInput()
      .clear({ force: true })
      .type(address.lastName, { force: true });
    this.getCompanyInput().type(address.company, { force: true });
    this.getAddress1Input().type(address.address1, { force: true });
    this.getAddress2Input().type(address.address2, { force: true });
    this.getZipInput().type(address.zipCode, { force: true });
    this.getCityInput().type(address.city, { force: true });
    this.getPhoneInput().type(address.phone, { force: true });
  };
}
