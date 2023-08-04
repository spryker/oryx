import { GlueAPI } from '../support/apis/glue.api';
import { CheckoutPage } from '../support/page-objects/checkout.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

let api: GlueAPI;
const checkoutPage = new CheckoutPage();

describe('User addresses suite', () => {
  describe('for guest user: ', () => {
    it('should show shipping address form if user does not have addresses (guest)', () => {
      api = new GlueAPI();

      cy.createGuestCart(api);
      cy.addProductToGuestCart(api, 1, ProductStorage.getByEq(4));
      cy.goToGuestCheckout();

      verifyDefaultAddressesView();
    });
  });

  describe('for authenticated user: ', () => {
    beforeEach(() => {
      api = new GlueAPI();

      cy.loginApi(api);
      cy.customerCleanup(api);
      cy.addProductToCart(api);
    });

    describe('without addresses: ', () => {
      it('should show shipping address form if user does not have addresses (authenticated)', () => {
        cy.goToCheckout();
        verifyDefaultAddressesView();
      });
    });

    describe('with addresses: ', () => {
      const addresses = [
        {
          type: checkoutPage.shipping,
          name: 'shipping address',
        },
        {
          type: checkoutPage.billing,
          name: 'billing address',
        },
      ];

      let randomCity1;
      let randomCity2;

      beforeEach(() => {
        randomCity1 = `Random City ${Math.random()}`;
        randomCity2 = `Random City ${Math.random()}`;

        cy.addAddress(api, { city: randomCity1 });
        cy.addAddress(api, { city: randomCity2 });

        cy.goToCheckout();
      });

      it('should show addresses if user has some', () => {
        verifyAddressesVisibility(checkoutPage.shipping);
        verifyAddressesVisibility(checkoutPage.billing);

        verifyAddressListInModalAndCheckAddressChange({
          addressType: checkoutPage.shipping,
          numberOfAddresses: 2,
          firstAddressCity: randomCity1,
        });

        verifyAddressListInModalAndCheckAddressChange({
          addressType: checkoutPage.billing,
          numberOfAddresses: 2,
          firstAddressCity: randomCity1,
        });
      });

      addresses.forEach((address) => {
        it(`should add, edit and delete ${address.name} without errors`, () => {
          address.type.addressesList.openChangeAddressesModal();
          address.type.addressChangeModal.addAddress({
            lastName: `User ${Math.random()}`,
          });

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
