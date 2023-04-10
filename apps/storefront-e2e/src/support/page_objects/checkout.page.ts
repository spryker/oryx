import { CartTotalsFragment } from '../page_fragments/cart-totals.fragment';
import { CheckoutAddressFormFragment } from '../page_fragments/checkout/checkout-address-form.fragment';
import { CheckoutAddressModalFragment } from '../page_fragments/checkout/checkout-address-modal.fragment';
import { CheckoutContactFragment } from '../page_fragments/checkout/checkout-contact.fragment';
import { AbstractSFPage } from './abstract.page';

export class CheckoutPage extends AbstractSFPage {
  url = '/checkout';

  waitForLoadedSPA(): void {
    this.getCartTotals.getTotalPrice().should('be.visible');
  }

  waitForLoadedSSR(): void {
    this.waitForLoadedSPA();
  }

  getCheckoutAsGuestBtn = () => cy.get('checkout-guest').find('button');

  contactForm = new CheckoutContactFragment();
  addressForm = new CheckoutAddressFormFragment();
  addressList = new CheckoutAddressModalFragment('checkout-address');
  addressChangeModal = new CheckoutAddressModalFragment('oryx-modal');

  getChangeAddressesButton = () => cy.get('oryx-checkout-manage-address');
  getCartTotals = new CartTotalsFragment();
  getPlaceOrderBtn = () => cy.get('checkout-place-order');

  openChangeAddressesModal = () => {
    this.getChangeAddressesButton().click();
  };
}
