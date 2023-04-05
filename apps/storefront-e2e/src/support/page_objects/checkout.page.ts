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

  getCheckoutAddressWrapper = () => cy.get('checkout-address');
  getPlaceOrderBtn = () => cy.get('checkout-place-order');
  getCountrySelect = () => cy.get('oryx-select[label="Country"]');
  getSalutationSelect = () => cy.get('oryx-select[label="Salutation"]');
  getFirstNameInput = () =>
    this.getCheckoutAddressWrapper().find('input[name="firstName"]');
  getLastNameInput = () =>
    this.getCheckoutAddressWrapper().find('input[name="lastName"]');
  getCompanyInput = () => cy.get('input[name="company"]');
  getAddress1Input = () => cy.get('input[name="address1"]');
  getAddress2Input = () => cy.get('input[name="address2"]');
  getZipInput = () => cy.get('input[name="zipCode"]');
  getCityInput = () => cy.get('input[name="city"]');
  getPhoneInput = () => cy.get('input[name="phone"]');

  getCheckoutContactWrapper = () => cy.get('checkout-contact');
  getGuestEmailInput = () =>
    this.getCheckoutContactWrapper().find('input[name="email"]');
  getGuestFirstNameInput = () =>
    this.getCheckoutContactWrapper().find('input[name="firstName"]');
  getGuestLastNameInput = () =>
    this.getCheckoutContactWrapper().find('input[name="lastName"]');

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

    this.selectCoutry('Germany');
    this.selectSalutation('Mr');
    this.getFirstNameInput().type('Test');
    this.getLastNameInput().type('User');
    this.getCompanyInput().type('Spryker');
    this.getAddress1Input().type('Heidestraße 9-10');
    this.getAddress2Input().type('appt 1');
    this.getZipInput().type('10557');
    this.getCityInput().type('Berlin');
    this.getPhoneInput().type('+49 30 208498350');
  };

  fillUserContactForm = () => {
    this.getGuestFirstNameInput().type('Test');
    this.getGuestLastNameInput().type('User');
    this.getGuestEmailInput().type('test@test.test');
  };
}
