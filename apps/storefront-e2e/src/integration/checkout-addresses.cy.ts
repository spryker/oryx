import { GlueAPI } from '../support/apis/glue.api';
import { CheckoutPage } from '../support/page-objects/checkout.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';
import { Customer } from '../support/types/user.type';

let api: GlueAPI;

const checkoutPage = new CheckoutPage();

describe('User addresses suite', () => {
  describe('when user is guest', () => {
    beforeEach(() => {
      api = new GlueAPI();
      api.guestCarts.get();
    });

    describe('and user has some products in the cart', () => {
      beforeEach(() => {
        cy.addItemsToTheGuestCart(api, 1, ProductStorage.getByEq(4));
      });

      describe('and user goes to checkout', () => {
        beforeEach(() => {
          cy.goToGuestCheckout();
        });

        it('then shipping address form is shown and billing address is the same as shipping', () => {
          verifyDefaultAddressesView();
        });
      });
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      api = new GlueAPI();

      cy.loginApi();

      cy.fixture<Customer>('test-customer').then((customer) => {
        cy.customerCartsCleanup(api, customer);
        cy.customerAddressesCleanup(api, customer);
      });
    });

    describe('and user has some products in the cart', () => {
      beforeEach(() => {
        const productData = ProductStorage.getByEq(0);

        cy.fixture<Customer>('test-customer').then((customer) => {
          // get all customer carts
          api.carts.customersGet(customer.id).then((customerCartsResponse) => {
            const cartId = customerCartsResponse.body.data[0].id;
            // add 1 item to the first cart
            api.cartItems.post(productData, 1, cartId);
          });
        });
      });

      describe('and user does not have addresses yet', () => {
        describe('and user goes to checkout', () => {
          beforeEach(() => {
            cy.intercept('/assets/addresses/*.json').as('addressesRequest');
            cy.goToCheckout();
            cy.wait('@addressesRequest');
          });

          it('then shipping address form is shown and billing address is the same as shipping', () => {
            verifyDefaultAddressesView();
          });
        });
      });

      describe('and user already has addresses', () => {
        const randomCity1 = `Random City ${Math.random()}`;
        const randomCity2 = `Random City ${Math.random()}`;

        beforeEach(() => {
          cy.fixture<Customer>('test-customer').then((customer) => {
            api.addresses.post(customer.id, { city: randomCity1 });
            api.addresses.post(customer.id, { city: randomCity2 });
          });
        });

        describe('and user goes to checkout', () => {
          const addressData = {
            lastName: `User ${Math.random()}`,
          };

          beforeEach(() => {
            cy.goToCheckout();
          });

          it('then addresses are shown on page and in addresses modals and user can change them', () => {
            verifyAddressesVisibility(checkoutPage.shipping);
            verifyAddressesVisibility(checkoutPage.billing);

            // shipping addresses
            verifyAddressListInModalAndCheckAddressChange({
              addressType: checkoutPage.shipping,
              numberOfAddresses: 2,
              firstAddressCity: randomCity1,
            });

            // billing addresses
            verifyAddressListInModalAndCheckAddressChange({
              addressType: checkoutPage.billing,
              numberOfAddresses: 2,
              firstAddressCity: randomCity1,
            });
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
            describe(`and user adds, edits and deletes ${address.name}`, () => {
              it(`then ${address.name} is added, edited and deleted without errors`, () => {
                // add address
                address.type.addressesList.openChangeAddressesModal();
                address.type.addressChangeModal.addAddress(addressData);

                verifyAddressesListInModal(address.type, 3);

                // edit address
                const newCity = 'New Address 1';
                const addressEq = 0;

                address.type.addressChangeModal.editCity(newCity, addressEq);

                // we still have 3 addresses
                verifyAddressesListInModal(address.type, 3);

                // and edited address is visible
                address.type.addressChangeModal.addressesList
                  .getAddressListItem()
                  .eq(addressEq)
                  .find('oryx-user-address')
                  .shadow()
                  .should('contain.text', newCity);

                // delete address
                address.type.addressChangeModal.removeAddress(0);

                // 3 - 1 = 2
                verifyAddressesListInModal(address.type, 2);
              });
            });
          });
        });
      });
    });
  });
});

function verifyDefaultAddressesView() {
  // shipping addresses
  checkoutPage.shipping.addAddressForm.getAddressForm().should('be.visible');
  checkoutPage.shipping.addAddressForm.getCityInput().should('be.visible');
  checkoutPage.shipping.addressesList.getAddressList().should('not.exist');

  // billing addresses
  checkoutPage.billing.addAddressForm.getAddressForm().should('not.exist');
  checkoutPage.billing.addressesList.getAddressList().should('not.exist');
  checkoutPage.billing.addAddressForm
    .getWrapper()
    .shadow()
    .should('contain.text', 'Same as shipping address');
}

function verifyAddressesVisibility(addressType) {
  addressType.addAddressForm.getAddressForm().should('not.exist');
  addressType.addressesList.getChangeAddressesButton().should('be.visible');
  addressType.addressesList.getMultiLineAddress().should('be.visible');
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

function verifyAddressListInModalAndCheckAddressChange(params: {
  addressType;
  numberOfAddresses: number;
  firstAddressCity: string;
}) {
  params.addressType.addressesList.openChangeAddressesModal();

  verifyAddressesListInModal(params.addressType, params.numberOfAddresses);

  params.addressType.addressChangeModal.selectAddress(0);

  params.addressType.addressesList
    .getMultiLineAddress()
    .shadow()
    .should('contain.text', params.firstAddressCity);
}
