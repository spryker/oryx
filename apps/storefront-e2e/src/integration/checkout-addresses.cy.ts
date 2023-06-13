import { CartPage } from '../support/page_objects/cart.page';
import { CheckoutPage } from '../support/page_objects/checkout.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';
import { defaultUser } from '../test-data/default-user';
import { ProductStorage } from '../test-data/product.storage';

let api: SCCOSApi;

const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

describe('User addresses', () => {
  beforeEach(() => {
    api = new SCCOSApi();

    cy.login(defaultUser);

    cy.customerCartsCleanup(api, defaultUser);
    cy.customerAddressesCleanup(api, defaultUser);
  });

  describe('when user opens the cart page', () => {
    beforeEach(() => {
      const productData = ProductStorage.getProductByEq(0);

      // get all customer carts
      api.carts.customersGet(defaultUser.id).then((customerCartsResponse) => {
        // add 1 item to the first cart
        api.cartItems.post(
          productData,
          1,
          customerCartsResponse.body.data[0].id
        );
      });

      cartPage.visit();
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
        api.addresses.post(defaultUser.id);
        api.addresses.post(defaultUser.id);
      });

      describe('and user goes to checkout', () => {
        beforeEach(() => {
          cartPage.checkout();
        });

        it('then the selected address is shown', () => {
          checkCheckoutAddresses();
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
              checkAddressesListInModal(address.type, 2);
            });

            describe('and user adds new address', () => {
              beforeEach(() => {
                address.type.addressChangeModal.addAddress();
              });

              it('new address appears', () => {
                checkAddressesListInModal(address.type, 3);
                address.type.addressChangeModal.closeModal();
                checkCheckoutAddresses();
              });
            });

            describe('and user edits existing address', () => {
              const newCompany = 'Edited Company';

              beforeEach(() => {
                address.type.addressChangeModal.editCompanyInAddress(
                  newCompany
                );
              });

              it('edited address appears', () => {
                // check addresses in modal after edit
                checkAddressesListInModal(address.type, 2);

                address.type.addressChangeModal.addressesList
                  .getAddressListItem()
                  .eq(0)
                  .find('oryx-user-address')
                  .shadow()
                  .should('contain.text', newCompany);

                // close modal
                address.type.addressChangeModal.closeModal();

                // check addresses in billing and shipping lists
                checkCheckoutAddresses();

                checkoutPage.shipping.addressesList
                  .getAddressListItem()
                  .eq(0)
                  .find('oryx-user-address')
                  .shadow()
                  .should('contain.text', newCompany);

                checkoutPage.billing.addressesList
                  .getAddressListItem()
                  .eq(0)
                  .find('oryx-user-address')
                  .shadow()
                  .should('contain.text', newCompany);
              });
            });

            describe('and user removes existing address', () => {
              beforeEach(() => {
                address.type.addressChangeModal.removeAddress();
              });

              it('removed address disappears', () => {
                checkAddressesListInModal(address.type, 1);
                address.type.addressChangeModal.closeModal();
                checkCheckoutAddresses();
              });
            });
          });
        });
      });
    });
  });
});

function checkCheckoutAddresses() {
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

function checkAddressesListInModal(addressType, numberOfAddresses: number) {
  addressType.addressChangeModal.getAddAddressButton().should('be.visible');
  addressType.addressChangeModal.addressesList
    .getAddressList()
    .should('be.visible');
  addressType.addressChangeModal.addressesList
    .getAddressListItem()
    .should('have.length', numberOfAddresses);
}
