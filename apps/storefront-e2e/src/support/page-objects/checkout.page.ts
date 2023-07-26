import { AddEditAddressFormFragment } from '../page-fragments/add-edit-address-form.fragment';
import { AddressesListFragment } from '../page-fragments/addresses-list.fragment';
import { AddressesModalFragment } from '../page-fragments/addresses-modal.fragment';
import { CartTotalsFragment } from '../page-fragments/cart-totals.fragment';
import { CheckoutAsGuestFormFragment } from '../page-fragments/checkout-as-guest-form.fragment';
import { AbstractSFPage } from './abstract.page';

export class CheckoutPage extends AbstractSFPage {
  url = '/checkout';
  anonymousUrl = '/checkout';

  waitForLoaded(): void {
    this.getCartTotals.getTotalPrice().should('be.visible');
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
