import { ProductDetailsPage } from '../support/page_objects/product-details.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';
import { ProductStorage } from '../test-data/product.storage';

const productDetailPage = new ProductDetailsPage();

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

    it('should show correct content', { tags: 'smoke' }, () => {
      productDetailPage.getAvailability().should('be.visible');
      pdp.getRelations().getProducts().should('not.exist');
    });
  });

  describe('when product has reference products', () => {
    const productData = ProductStorage.getProductByEq(3);
    const pdp = new ProductDetailsPage(productData);

    beforeEach(() => {
      pdp.visit();
    });

    it('should show product references', () => {
      pdp.getRelations().getProducts().should('be.visible');
    });
  });
});
