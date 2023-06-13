import { defaultAddress } from '../../../../src/test-data/default-address';

export class CheckoutAddressFormFragment {
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

  fillAddressForm = () => {
    // wait till form is rendered and ready
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.disableAnimations();

    this.selectCoutry(defaultAddress.iso2Code);
    this.selectSalutation(defaultAddress.salutation);
    this.getFirstNameInput().type(defaultAddress.firstName);
    this.getLastNameInput().type(defaultAddress.lastName);
    this.getCompanyInput().type(defaultAddress.company);
    this.getAddress1Input().type(defaultAddress.address1);
    this.getAddress2Input().type(defaultAddress.address2);
    this.getZipInput().type(defaultAddress.zipCode);
    this.getCityInput().type(defaultAddress.city);
    this.getPhoneInput().type(defaultAddress.phone);
  };
}
