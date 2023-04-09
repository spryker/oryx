import { defaultAddress } from '../../test-data/default-address';
import { AbstractSFPage } from './abstract.page';

export class CheckoutPage extends AbstractSFPage {
  url = '/checkout';

  waitForLoadedSPA(): void {
    this.waitForLoadedSSR();
  }

  waitForLoadedSSR(): void {
    this.getPlaceOrderBtn().should('be.visible');
  }

  getCheckoutAsGuestBtn = () =>
    cy.contains('oryx-button', 'Checkout as a guest');

  getAddressWrapper = () => cy.get('checkout-address');

  // checkout address form
  getAddressForm = () => cy.get('oryx-address-form');
  getPlaceOrderBtn = () => cy.get('checkout-place-order');
  getCountrySelect = () => cy.get('oryx-select[label="Country"]');
  getSalutationSelect = () => cy.get('oryx-select[label="Salutation"]');
  getFirstNameInput = () => this.getAddressForm().find('input[name="firstName"]');
  getLastNameInput = () => this.getAddressForm().find('input[name="lastName"]');
  getCompanyInput = () => cy.get('input[name="company"]');
  getAddress1Input = () => cy.get('input[name="address1"]');
  getAddress2Input = () => cy.get('input[name="address2"]');
  getZipInput = () => cy.get('input[name="zipCode"]');
  getCityInput = () => cy.get('input[name="city"]');
  getPhoneInput = () => cy.get('input[name="phone"]');

  selectCoutry = (country: string) => {
    this.getCountrySelect().click();
    this.getCountrySelect()
      .contains('oryx-option', country)
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

  // checkout address list
  getAddressesList = () => cy.get('oryx-address-list');


  // checkout contact 
  getCheckoutContact = () => cy.get('checkout-contact');
  getGuestEmailInput = () =>
    this.getCheckoutContact().find('input[name="email"]');
  getGuestFirstNameInput = () =>
    this.getCheckoutContact().find('input[name="firstName"]');
  getGuestLastNameInput = () =>
    this.getCheckoutContact().find('input[name="lastName"]');

  fillUserContactForm = () => {
    this.getGuestFirstNameInput().type('Test');
    this.getGuestLastNameInput().type('User');
    this.getGuestEmailInput().type('test@test.test');
  };
}
