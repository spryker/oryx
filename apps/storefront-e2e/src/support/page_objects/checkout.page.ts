import { AddEditAddressFormFragment } from '../page_fragments/add-edit-address-form.fragment';
import { AddressesListFragment } from '../page_fragments/addresses-list.fragment';
import { AddressesModalFragment } from '../page_fragments/addresses-modal.fragment';
import { CartTotalsFragment } from '../page_fragments/cart-totals.fragment';
import { CheckoutAsGuestFormFragment } from '../page_fragments/checkout/checkout-as-guest-form.fragment';
import { AbstractSFPage } from './abstract.page';

export class CheckoutPage extends AbstractSFPage {
  url = '/checkout';
  anonymousUrl = '/checkout';

  waitForLoadedSPA(): void {
    this.getCartTotals.getTotalPrice().should('be.visible');
  }

  waitForLoadedSSR(): void {
    this.waitForLoadedSPA();
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

  getCartTotals = new CartTotalsFragment();
  getPlaceOrderBtn = () => cy.get('oryx-checkout-place-order');
}
