import { CartTotalsFragment } from '../page_fragments/cart-totals.fragment';
import { CheckoutAddressFormFragment } from '../page_fragments/checkout/checkout-address-form.fragment';
import { CheckoutAddressListFragment } from '../page_fragments/checkout/checkout-address-list.fragment';
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
  addressList = new CheckoutAddressListFragment();

  getCartTotals = new CartTotalsFragment();
  getPlaceOrderBtn = () => cy.get('checkout-place-order');
}
