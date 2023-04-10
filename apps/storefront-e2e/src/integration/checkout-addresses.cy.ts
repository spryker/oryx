import { ProductStorage } from "../test-data/product.storage";
import { defaultUser } from "../test-data/default-user";
import { CartPage } from "../support/page_objects/cart.page";
import { CheckoutPage } from "../support/page_objects/checkout.page";
import { SCCOSApi } from "../support/sccos_api/sccos.api"

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
      api.carts.customersGet(defaultUser.id).then(customerCartsResponse => {
        // add 1 item to the first cart
        api.cartItems.post(productData, 1, customerCartsResponse.body.data[0].id)
      });

      cartPage.visit();
    });

    describe('and user does not have addresses yet', () => {
      describe('and user goes to chechout', () => {
        beforeEach(() => {
          cartPage.checkout();
        });

        it('then default address form is shown', () => {
          checkoutPage.addressForm.getAddressForm().should('be.visible');
          checkoutPage.addressList.getAddressList().should('not.exist');
        });
      });
    });

    describe('and user already has addresses', () => {
      beforeEach(() => {
        api.addresses.post(defaultUser.id);
      });

      describe('and user goes to chechout', () => {
        beforeEach(() => {
          cartPage.checkout();
        });

        it('then the list of addresses is shown', () => {
          checkoutPage.addressForm.getAddressForm().should('not.exist');
          checkoutPage.getChangeAddressesButton().should('be.visible');
          checkoutPage.addressList.getAddressList().should('be.visible');
          checkoutPage.addressList.getAddressListItem().should('have.length', 1);
        });

        describe('and user wants to change addresses', () => {
          beforeEach(() => {
            checkoutPage.openChangeAddressesModal();
          });

          it('then the addresses modal is open', () => {
            checkoutPage.addressChangeModal.getAddAddressButton().should('be.visible');
            checkoutPage.addressChangeModal.getAddressList().should('be.visible');
            checkoutPage.addressChangeModal.getAddressListItem().should('have.length', 1);
          });

          describe('and user adds new address', () => {
            beforeEach('test', () => {
              checkoutPage.addressChangeModal.addAddress();
            });

            it.only('new address appears in both addresses lists', () => {
              // check new address in the modal list
              checkoutPage.addressChangeModal.getAddAddressButton().should('be.visible');
              checkoutPage.addressChangeModal.getAddressList().should('be.visible');
              checkoutPage.addressChangeModal.getAddressListItem().should('have.length', 2);

              checkoutPage.addressChangeModal.closeModal();

              // check new address in the checkout list
              checkoutPage.addressForm.getAddressForm().should('not.exist');
              checkoutPage.getChangeAddressesButton().should('be.visible');
              checkoutPage.addressList.getAddressList().should('be.visible');
              checkoutPage.addressList.getAddressListItem().should('have.length', 2);
            })
          })
        });
      });
    });
  })

  xit('must allow user to create new address if he already has one', () => {
    // click on change button
    // add new address (set it both default and billing address)
    // check that it appeared in 2 lists
  })

  xit('must allow user to edit an existing address', () => {
    // edit first address in the list
    // check that it was updated in 2 lists
  })

  xit('must allow user to delete existing address', () => {
    // delete first address in the list
    // check that it dissapeared from 2 lists
  })
})