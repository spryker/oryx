import { ProductStorage } from '../data-storages/product.storage';
import { Product } from '../interfaces/product.interface';
import { CartEntryFragment } from '../support/page_fragments/cart-entry.fragment';
import { CartPage } from '../support/page_objects/cart.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';

const cartPage = new CartPage();
const cartTotals = cartPage.getCartTotals();

let sccosApi: SCCOSApi;

describe('Cart spec', () => {
  beforeEach(() => {
    sccosApi = new SCCOSApi();
    sccosApi.getGuestCarts();
  });

  context('Cart Entry displaying', () => {
    it('HRZ-1403 | must show correct Cart Entry when product is added to the Cart', () => {
      const productData = ProductStorage.getProductByEq(2);

      sccosApi.postGuestCartsItems(productData, 1);
      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        checkCartEntry(entries[0], productData);

        entries[0].getQuantityInput().getInput().should('have.value', 1);
      });
    });

    it('HRZ-1017 | must show default product image if it is not set', () => {
      const productData = ProductStorage.getProductByEq(2);

      productData.previewImageURL = undefined;

      sccosApi.postGuestCartsItems(productData, 1);

      cy.intercept('GET', '**/concrete-products/**?include=*', (req) => {
        const include = req.query.include as string;

        req.query.include = include.replace('concrete-product-image-sets,', '');
        req.continue();
      });

      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        checkCartEntry(entries[0], productData);
      });
    });
  });

  context('"Cart is empty" message displaying', () => {
    it('HRZ-1404 | must show the message if no products were added', () => {
      cartPage.visit();

      checkCartEmptyState();
    });

    it('HRZ-1405 | must show the message if all entries are removed', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 1);
      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        const firstEntry = entries[0];

        firstEntry.remove();

        checkCartEmptyState();
      });
    });
  });

  context('Prices displaying', () => {
    it('must show correct Prices if 1 product with price <= 100€ is added', () => {
      const productData = ProductStorage.getProductByEq(2);

      sccosApi.postGuestCartsItems(productData, 1);
      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        checkCartEntryPrices(entries[0], productData);
      });

      checkCartTotals({
        subtotalText: '1 item',
        subtotalPrice: productData.currentPrice,
        taxTotal: '4.11',
        totalPrice: productData.currentPrice,
      });
    });

    it('must show correct Prices if 1 product with price > 100€ is added (10% minimum discount)', () => {
      const productData = ProductStorage.getProductByEq(3);

      sccosApi.postGuestCartsItems(productData, 1);
      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        checkCartEntryPrices(entries[0], productData, true);
      });

      checkCartTotals({
        subtotalText: '1 item',
        subtotalPrice: productData.currentPrice,
        discountsTotal: '-18.00',
        taxTotal: '10.60',
        totalPrice: productData.currentPriceWith10pDiscount,
      });
    });

    it('must show correct Prices if 2 products are added', () => {
      const product0Data = ProductStorage.getProductByEq(2);
      const product1Data = ProductStorage.getProductByEq(3);

      sccosApi.postGuestCartsItems(product0Data, 1);
      sccosApi.postGuestCartsItems(product1Data, 1);
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

  context('Prices updates after manipulations with Cart Entries', () => {
    it('HRZ-1022 | must increase # of items and prices (+ btn click)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 1);

      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        const firstEntry = entries[0];

        firstEntry.getQuantityInput().increase();

        firstEntry.getQuantityInput().getInput().should('have.value', 2);
        firstEntry.getTotalPrice().should('contain.text', '598.55');
        cartTotals.getTotalPrice().should('contain.text', '598.55');
      });
    });

    it('HRZ-1023 | must decrease # of items and prices (- btn click)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 2);

      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        const firstEntry = entries[0];

        firstEntry.getQuantityInput().decrease();

        firstEntry.getQuantityInput().getInput().should('have.value', 1);
        firstEntry.getTotalPrice().should('contain.text', '299.28');
        cartTotals.getTotalPrice().should('contain.text', '299.28');
      });
    });

    it('HRZ-1414 | must increase # of items and prices (input, manual)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 1);

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

    it('HRZ-1024 | must decrease # of items and prices (input, manual)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 2);

      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        const firstEntry = entries[0];

        firstEntry.getQuantityInput().getInput().type('{selectall}1');
        cy.get('body').click();

        firstEntry.getQuantityInput().getInput().should('have.value', 1);
        firstEntry.getTotalPrice().should('contain.text', '299.28');
        cartTotals.getTotalPrice().should('contain.text', '299.28');
      });
    });

    it('HRZ-1401 | must remove cart entry and change prices (trash btn click)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 1);
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(2), 1);

      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        entries[0].getQuantityInput().decrease();

        cartTotals.getTotalPrice().should('contain.text', '62.77');
      });
    });

    it('HRZ-820 | must remove cart entry and change prices (X btn click)', () => {
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(1), 1);
      sccosApi.postGuestCartsItems(ProductStorage.getProductByEq(2), 1);

      cartPage.visit();

      cartPage.getCartEntries().then((entries) => {
        entries[0].remove();

        cartTotals.getTotalPrice().should('contain.text', '62.77');
      });
    });
  });
});

function checkCartEntry(entry: CartEntryFragment, product: Product) {
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
  productData: Product,
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

  cartTotals.getDeliveryTotal().should('contain.text', 'not yet implemented');
  cartTotals.getTotalPrice().should('contain.text', expectedData.totalPrice);

  // covers HRZ-1008
  cartTotals.getTaxTotal().should('contain.text', expectedData.taxTotal);
  cartTotals
    .getTaxMessage()
    .should('be.visible')
    .and('contain.text', 'Tax included');
}

function checkCartEmptyState() {
  cartPage
    .getCartEntriesWrapper()
    .contains('Your shopping cart is empty')
    .should('be.visible');

  cartPage.getCartTotals().getWrapper().should('not.be.visible');
}
