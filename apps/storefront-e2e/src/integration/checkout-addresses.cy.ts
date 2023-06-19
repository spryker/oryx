import { CartPage } from '../support/page_objects/cart.page';
import { CheckoutPage } from '../support/page_objects/checkout.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';
import { ProductStorage } from '../test-data/product.storage';
import { TestCustomerData } from '../types/user.type';

let api: SCCOSApi;

const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

describe('User addresses', () => {
  beforeEach(() => {
    api = new SCCOSApi();

    cy.login();

    cy.fixture<TestCustomerData>('test-customer').then((customer) => {
      cy.customerCartsCleanup(api, customer);
      cy.customerAddressesCleanup(api, customer);
    });
  });

  describe('when user opens the cart page', () => {
    beforeEach(() => {
      const productData = ProductStorage.getProductByEq(0);

      cy.fixture<TestCustomerData>('test-customer').then((customer) => {
        // get all customer carts
        api.carts.customersGet(customer.id).then((customerCartsResponse) => {
          // add 1 item to the first cart
          api.cartItems.post(
            productData,
            1,
            customerCartsResponse.body.data[0].id
          );
        });

        cartPage.visit();
      });
    });

    describe('and user does not have addresses yet', () => {
      describe('and user goes to checkout', () => {
        beforeEach(() => {
          cartPage.checkout();
        });

        it('then shipping address form is shown', () => {
          checkoutPage.shipping.addAddressForm
            .getAddressForm()
            .should('be.visible');
          checkoutPage.shipping.addressesList
            .getAddressList()
            .should('not.exist');

          checkoutPage.billing.addAddressForm
            .getAddressForm()
            .should('not.exist');
          checkoutPage.billing.addressesList
            .getAddressList()
            .should('not.exist');
          checkoutPage.billing.addAddressForm
            .getWrapper()
            .shadow()
            .should('contain.text', 'Same as shipping address');
        });
      });
    });

    describe('and user already has addresses', () => {
      beforeEach(() => {
        cy.fixture<TestCustomerData>('test-customer').then((customer) => {
          api.addresses.post(customer.id);
          api.addresses.post(customer.id);
        });
      });

      describe('and user goes to checkout', () => {
        beforeEach(() => {
          cartPage.checkout();
        });

        it('then the selected address is shown', () => {
          verifyAddressesVisibility();
        });

        [
          {
            type: checkoutPage.shipping,
            name: 'shipping address',
          },
          {
            type: checkoutPage.billing,
            name: 'billing address',
          },
        ].forEach((address) => {
          describe(`and user wants to change ${address.name}`, () => {
            beforeEach(() => {
              address.type.addressesList.getChangeAddressesButton().click();
            });

            it('then the addresses modal is open', () => {
              verifyAddressesListInModal(address.type, 2);
            });

            describe('and user adds new address', () => {
              const addressData = {
                lastName: `User ${Math.random()}`,
              };

              beforeEach(() => {
                address.type.addressChangeModal.addAddress(addressData);
              });

              it('new address appears in the list', () => {
                verifyAddressesListInModal(address.type, 3);
              });

              describe('and when user selects new address', () => {
                beforeEach(() => {
                  address.type.addressChangeModal.selectAddress(2);
                });

                it('new address is visible on checkout page', () => {
                  verifyAddressesVisibility();
                  // verify that new address was selected successfully and is visible
                  address.type.addressesList
                    .getMultiLineAddress()
                    .shadow()
                    .should('contain.text', addressData.lastName);
                });
              });
            });

            describe('and user edits existing address', () => {
              const newAddress1 = 'New Address 1';
              const changedAddressEq = 0;

              beforeEach(() => {
                address.type.addressChangeModal.editAddress1InAddress(
                  newAddress1,
                  changedAddressEq
                );
              });

              it('edited address appears in the list', () => {
                verifyAddressesListInModal(address.type, 2);

                address.type.addressChangeModal.addressesList
                  .getAddressListItem()
                  .eq(changedAddressEq)
                  .find('oryx-user-address')
                  .shadow()
                  .should('contain.text', newAddress1);
              });
            });

            describe('and user removes existing address', () => {
              beforeEach(() => {
                address.type.addressChangeModal.removeAddress(0);
              });

              it('removed address disappears from the list', () => {
                verifyAddressesListInModal(address.type, 1);
              });
            });
          });
        });
      });
    });
  });
});

function verifyAddressesVisibility() {
  // check shipping addresses
  checkoutPage.shipping.addAddressForm.getAddressForm().should('not.exist');

  checkoutPage.shipping.addressesList
    .getChangeAddressesButton()
    .should('be.visible');
  checkoutPage.shipping.addressesList
    .getMultiLineAddress()
    .should('be.visible');

  // check billing addresses
  checkoutPage.billing.addAddressForm.getAddressForm().should('not.exist');

  checkoutPage.shipping.addressesList
    .getChangeAddressesButton()
    .should('be.visible');
  checkoutPage.billing.addressesList.getMultiLineAddress().should('be.visible');
}

function verifyAddressesListInModal(addressType, numberOfAddresses: number) {
  addressType.addressChangeModal.getAddAddressButton().should('be.visible');
  addressType.addressChangeModal.addressesList
    .getAddressList()
    .should('be.visible');
  addressType.addressChangeModal.addressesList
    .getAddressListItem()
    .should('have.length', numberOfAddresses);
}
