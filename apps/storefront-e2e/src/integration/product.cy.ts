import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

describe('Product Detail Page suite', () => {
  it('must show default product', { tags: 'smoke' }, () => {
    const productData = ProductStorage.getProductByEq(2);
    const pdp = new ProductDetailsPage(productData);

    pdp.visit();
    pdp.checkDefaultProduct();

    pdp.getRelations().getProducts().should('not.exist');
  });

  it('must show product with references', () => {
    const productData = ProductStorage.getProductByEq(3);
    const pdp = new ProductDetailsPage(productData);

    pdp.visit();
    pdp.checkDefaultProduct();

    pdp.getRelations().getProducts().should('be.visible');
  });
});
