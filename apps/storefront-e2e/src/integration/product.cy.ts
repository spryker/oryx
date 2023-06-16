import { ProductReferencesFragment } from '../support/page_fragments/product-references.fragment';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';
import { ProductStorage } from '../test-data/product.storage';

const productDetailPage = new ProductDetailsPage();
const productReferencesFragment = new ProductReferencesFragment();

let scosApi: SCCOSApi;

describe('Product Detail Page', () => {
  beforeEach(() => {
    scosApi = new SCCOSApi();
    scosApi.guestCarts.get();
  });

  describe('when the product page visited', () => {
    const productData = ProductStorage.getProductByEq(2);
    const pdp = new ProductDetailsPage(productData);

    beforeEach(() => {
      pdp.visit();
    });

    it('should show correct content', () => {
      productDetailPage.getAvailability().should('be.visible');
      productReferencesFragment.getProducts().should('not.exist');
    });
  });

  describe('when product has reference products', () => {
    const productData = ProductStorage.getProductByEq(5);
    const pdp = new ProductDetailsPage(productData);

    beforeEach(() => {
      pdp.visit();
    });

    it('should show product references', () => {
      productReferencesFragment.getProducts().should('be.visible');
    });
  });
});
