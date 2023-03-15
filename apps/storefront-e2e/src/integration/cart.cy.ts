import { ProductStorage } from '../data-storages/product.storage';
import { CartEntryFragment } from '../support/page_fragments/cart-entry.fragment';
import { CartPage } from '../support/page_objects/cart.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';
import { TestProductData } from '../types/product.type';

const cartPage = new CartPage();
const cartTotals = cartPage.getCartTotals();

let sccosApi: SCCOSApi;

describe('Cart suite', () => {
  beforeEach(() => {
    sccosApi = new SCCOSApi();
    sccosApi.guestCarts.get();
  });

  context('Cart Entries', () => {
    it('must show correct Cart Entry if product is added to the Cart', () => {
      const productData = ProductStorage.getProductByEq(2);

      sccosApi.guestCartItems.post(productData, 1);
      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        checkCartEntry(entries[0], productData);

        entries[0].getQuantityInput().getInput().should('have.value', 1);
      });
    });
  });

  context('"Cart is empty" message ', () => {
    it('is shown if cart entries are removed', () => {
      sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 1);
      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        const firstEntry = entries[0];

        firstEntry.remove();

        checkCartEmptyState();
      });
    });
  });

  // This check covers FE -> BE integration
  // it might be extended/changed, but we should not add additional stuff here
  // everything should already be covered by unit tests
  context('Prices displaying', () => {
    it('must show correct Prices if 2 products are added', () => {
      const product0Data = ProductStorage.getProductByEq(2);
      const product1Data = ProductStorage.getProductByEq(3);

      sccosApi.guestCartItems.post(product0Data, 1);
      sccosApi.guestCartItems.post(product1Data, 1);
      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        checkCartEntryPrices(entries[0], product0Data, true);
        checkCartEntryPrices(entries[1], product1Data, true);
      });

      checkCartTotals({
        subtotalText: '2 items',
        subtotalPrice: '242.78',
        discountsTotal: '-24.28',
        taxTotal: '14.29',
        totalPrice: '218.50',
      });
    });
  });

  context('Prices recalculation', () => {
    it('must recalculate the prices if + btn was clicked on any entry', () => {
      sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 1);

      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        const firstEntry = entries[0];

        firstEntry.getQuantityInput().increase();

        firstEntry.getQuantityInput().getInput().should('have.value', 2);
        firstEntry.getTotalPrice().should('contain.text', '598.55');
        cartTotals.getTotalPrice().should('contain.text', '598.55');
      });
    });

    it('must recalculate the prices if user manualy chaged number of items in any entry', () => {
      sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 3);

      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        const firstEntry = entries[0];

        firstEntry.getQuantityInput().getInput().type('{selectall}2');
        cy.get('body').click();

        firstEntry.getQuantityInput().getInput().should('have.value', 2);
        firstEntry.getTotalPrice().should('contain.text', '598.55');
        cartTotals.getTotalPrice().should('contain.text', '598.55');
      });
    });

    it('must recalculate the prices if user removes entry from the cart', () => {
      sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 1);
      sccosApi.guestCartItems.post(ProductStorage.getProductByEq(2), 1);

      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        entries[0].getQuantityInput().decrease();

        cartTotals.getTotalPrice().should('contain.text', '62.77');
      });
    });
  });
});

function checkCartEntry(entry: CartEntryFragment, product: TestProductData) {
  entry.getTitle().should('contain.text', product.title);
  entry.getSKU().should('contain.text', product.id);

  if (product.previewImageURL) {
    entry
      .getActiveImage()
      .invoke('attr', 'src')
      .should('contain', product.previewImageURL);
  } else {
    entry.getDefaultImage().invoke('attr', 'type').should('contain', 'image');
  }
}

function checkCartEntryPrices(
  entry: CartEntryFragment,
  productData: TestProductData,
  isDiscounted = false
) {
  entry.getPrice().should('contain.text', productData.currentPrice);
  entry.getSubtotal().should('contain.text', productData.currentPrice);
  entry
    .getTotalPrice()
    .should(
      'contain.text',
      isDiscounted
        ? productData.currentPriceWith10pDiscount
        : productData.currentPrice
    );
}

interface CartTotalsExpectedData {
  subtotalText: string;
  subtotalPrice: string;
  discountsTotal?: string;
  taxTotal: string;
  totalPrice: string;
}

function checkCartTotals(expectedData: CartTotalsExpectedData) {
  cartTotals
    .getSubtotalPrice()
    .should('contain.text', expectedData.subtotalPrice);

  if (expectedData.discountsTotal) {
    cartTotals
      .getDiscountsTotal()
      .should(
        'contain.text',
        Math.abs(parseFloat(expectedData.discountsTotal)).toString()
      );
  } else {
    cartTotals.getDiscountsWrapper().should('not.exist');
  }

  // should be fixed in https://spryker.atlassian.net/browse/HRZ-2353
  // cartTotals.getDeliveryTotal().should('contain.text', 'not yet implemented');
  cartTotals.getTotalPrice().should('contain.text', expectedData.totalPrice);

  // covers HRZ-1008
  cartTotals.getTaxTotal().should('contain.text', expectedData.taxTotal);
  cartTotals
    .getTaxMessage()
    .should('be.visible')
    .and('contain.text', 'Incl vat');
}

function checkCartEmptyState() {
  cartPage
    .getCartEntriesWrapper()
    .contains('Your shopping cart is empty')
    .should('be.visible');

  cartPage.getCartTotals().getWrapper().should('not.be.visible');
}
