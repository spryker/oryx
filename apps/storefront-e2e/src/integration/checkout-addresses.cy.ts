import { CartPage } from '../support/page_objects/cart.page';
import { CheckoutPage } from '../support/page_objects/checkout.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';
import { defaultUser } from '../test-data/default-user';
import { ProductStorage } from '../test-data/product.storage';

let api: SCCOSApi;

const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

xdescribe('User addresses', () => {
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
        api.addresses.post(defaultUser.id);
      });

      describe('and user goes to chechout', () => {
        beforeEach(() => {
          cartPage.checkout();
        });

        it('then the list of addresses is shown', () => {
          checkCheckoutAddressesList(2);
        });

        describe('and user wants to change addresses', () => {
          beforeEach(() => {
            checkoutPage.openChangeAddressesModal();
          });

          it('then the addresses modal is open', () => {
            checkAddressesListInModal(2);
          });

          describe('and user adds new address', () => {
            beforeEach(() => {
              checkoutPage.addressChangeModal.addAddress();
            });

            it('new address appears in both addresses lists', () => {
              checkAddressesListInModal(3);
              checkoutPage.addressChangeModal.closeModal();
              checkCheckoutAddressesList(3);
            });
          });

          describe('and user edits existing address', () => {
            const newCompany = 'Edited Company';

            beforeEach(() => {
              checkoutPage.addressChangeModal.editCompanyInAddress(newCompany);
            });

            it('edited address appears in both addresses lists', () => {
              checkAddressesListInModal(2);
              checkoutPage.addressChangeModal
                .getAddressListItem()
                .eq(0)
                .find('oryx-user-address')
                .shadow()
                .should('contain.text', newCompany);

              checkoutPage.addressChangeModal.closeModal();

              checkCheckoutAddressesList(2);
              checkoutPage.addressList
                .getAddressListItem()
                .eq(0)
                .find('oryx-user-address')
                .shadow()
                .should('contain.text', newCompany);
            });
          });

          describe('and user removes existing address', () => {
            beforeEach(() => {
              checkoutPage.addressChangeModal.removeAddress();
            });

            it('removed address dissapeares in both address lists', () => {
              checkAddressesListInModal(1);
              checkoutPage.addressChangeModal.closeModal();
              checkCheckoutAddressesList(1);
            });
          });
        });
      });
    });
  });
});

function checkCheckoutAddressesList(numberOfAddresses: number) {
  checkoutPage.addressForm.getAddressForm().should('not.exist');
  checkoutPage.getChangeAddressesButton().should('be.visible');
  checkoutPage.addressList.getAddressList().should('be.visible');
  checkoutPage.addressList
    .getAddressListItem()
    .should('have.length', numberOfAddresses);
}

function checkAddressesListInModal(numberOfAddresses: number) {
  checkoutPage.addressChangeModal.getAddAddressButton().should('be.visible');
  checkoutPage.addressChangeModal.getAddressList().should('be.visible');
  checkoutPage.addressChangeModal
    .getAddressListItem()
    .should('have.length', numberOfAddresses);
}
