import { AbstractSFPage } from './abstract.page';

export class CheckoutPage extends AbstractSFPage {
  url = '/checkout';

  waitForLoadedSPA(): void {
    cy.intercept('**/customers/*/addresses').as('addresses');
    this.waitForLoadedSSR();
    cy.wait('@addresses');
  }

  waitForLoadedSSR(): void {
    this.getPlaceOrderBtn().should('be.visible');
  }

  getPlaceOrderBtn = () => cy.get('checkout-place-order');
  getCountrySelect = () => cy.get('oryx-select[label="Country"]');
  getSalutationSelect = () => cy.get('oryx-select[label="Salutation"]');
  getFirstNameInput = () => cy.get('input[name="firstName"]');
  getLastNameInput = () => cy.get('input[name="lastName"]');
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
      .click({ force: true });
  };

  selectSalutation = (salutation: string) => {
    this.getSalutationSelect().click();
    this.getSalutationSelect()
      .contains('oryx-option', salutation)
      .click({ force: true });
  };

  fillAddressForm = () => {
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
}
