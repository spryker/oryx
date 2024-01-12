import { AddEditAddressFormFragment } from '../page-fragments/add-edit-address-form.fragment';
import { AddressesListFragment } from '../page-fragments/addresses-list.fragment';
import { AddressesModalFragment } from '../page-fragments/addresses-modal.fragment';
import { CheckoutAsGuestFormFragment } from '../page-fragments/checkout-as-guest-form.fragment';
import { TotalsFragment } from '../page-fragments/totals.fragment';
import { AbstractSFPage } from './abstract.page';

export class CheckoutPage extends AbstractSFPage {
  url = '/checkout';

  waitForLoaded(): void {
    this.getCartTotals().getTotalPrice().should('be.visible');
  }

  checkoutAsGuestForm = new CheckoutAsGuestFormFragment();

  shipping = {
    addressesList: new AddressesListFragment('oryx-checkout-shipping-address'),
    addAddressForm: new AddEditAddressFormFragment(
      'oryx-checkout-shipping-address'
    ),
    addressChangeModal: new AddressesModalFragment(
      'oryx-checkout-shipping-address'
    ),
  };

  billing = {
    addressesList: new AddressesListFragment('oryx-checkout-billing-address'),
    addAddressForm: new AddEditAddressFormFragment(
      'oryx-checkout-billing-address'
    ),
    addressChangeModal: new AddressesModalFragment(
      'oryx-checkout-billing-address'
    ),
  };

  getCartTotals = () => new TotalsFragment('oryx-cart-totals');
  getPlaceOrderBtn = () => cy.get('oryx-checkout-place-order');
  getShippingWrapper = () => cy.get('oryx-checkout-shipping-method');
  getShippingMethods = () => this.getShippingWrapper().find('oryx-tile');
  getPaymentWrapper = () => cy.get('oryx-checkout-payment-method');
  getPaymentMethods = () => this.getPaymentWrapper().find('oryx-tile');
  getEntries = () => cy.get('oryx-cart-entries');

  placeOrder = () => {
    this.order('/checkout');
  };

  placeOrderAsGuest = () => {
    this.order('/checkout?include=*');
  };

  private order = (url: string) => {
    cy.intercept('POST', url).as('checkout');
    this.getPlaceOrderBtn().click();
    cy.wait('@checkout')
      .its('response.body.data.attributes.orderReference')
      .as('createdOrderId');
  };

  templateIsReady = () => {
    //email input is ready
    this.checkoutAsGuestForm
      .getEmailInput()
      .should('be.visible', { timeout: 10000 });

    //shipping address form is ready
    this.shipping.addAddressForm
      .getCountrySelect()
      .should('be.visible', { timeout: 10000 });
    this.shipping.addAddressForm
      .getSalutationSelect()
      .should('be.visible', { timeout: 10000 });

    //shipping methods are ready
    this.getShippingWrapper()
      .find('oryx-tile[selected]')
      .should('be.visible', { timeout: 10000 });

    //payment methods are ready
    this.getPaymentWrapper()
      .find('oryx-tile[selected]')
      .should('be.visible', { timeout: 10000 });

    //entries are ready
    this.getEntries()
      .find('oryx-cart-entry')
      .find('oryx-product-title')
      .should('be.visible', { timeout: 10000 });
  };
}
