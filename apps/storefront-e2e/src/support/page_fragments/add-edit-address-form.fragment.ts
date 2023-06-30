import { defaultAddress } from '../../test-data/default-address';

export class AddEditAddressFormFragment {
  private wrapperSelector: string;

  constructor(selector: string) {
    this.wrapperSelector = selector;
  }

  getWrapper = () => cy.get(this.wrapperSelector);
  getAddressForm = () => this.getWrapper().find('oryx-user-address-form');
  getCountrySelect = () =>
    this.getWrapper().find('oryx-select[label="Country"]');
  getSalutationSelect = () =>
    this.getWrapper().find('oryx-select[label="Salutation"]');
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
    this.getCountrySelect()
      .find(`oryx-option[value="${isoCode}"]`)
      .should('be.visible')
      .click({ force: true });
  };

  selectSalutation = (salutation: string) => {
    this.getSalutationSelect().click();
    this.getSalutationSelect()
      .contains('oryx-option', salutation)
      .should('be.visible')
      .click({ force: true });
  };

  fillAddressForm = (addressData?) => {
    const address = { ...defaultAddress, ...addressData };

    // wait till form is rendered and ready
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.disableAnimations();

    this.selectCoutry(address.iso2Code);
    this.selectSalutation(address.salutation);
    this.getFirstNameInput().clear().type(address.firstName, { force: true });
    this.getLastNameInput().clear().type(address.lastName, { force: true });
    this.getCompanyInput().type(address.company);
    this.getAddress1Input().type(address.address1);
    this.getAddress2Input().type(address.address2);
    this.getZipInput().type(address.zipCode);
    this.getCityInput().type(address.city);
    this.getPhoneInput().type(address.phone);
  };
}
