import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

describe('Product details page suite', () => {
  it('should show product details', { tags: 'smoke' }, () => {
    const productData = ProductStorage.getByEq(2);
    const pdp = new ProductDetailsPage(productData);

    pdp.visit();
    pdp.checkDefaultProduct();

    pdp.getRelations().getProducts().should('not.exist');
  });

  it('should show product with relations', () => {
    const productData = ProductStorage.getByEq(3);
    const pdp = new ProductDetailsPage(productData);

    pdp.visit();
    pdp.checkDefaultProduct();

    pdp.getRelations().getProducts().should('be.visible');
  });

  it('should update prices when price mode changes', () => {
    const productData = ProductStorage.getByEq(2);
    const pdp = new ProductDetailsPage(productData);

    pdp.visit();
    pdp.checkDefaultProduct();

    pdp.header.changePriceMode('NET_MODE');
    pdp.getPrice().should('contain.text', productData.netModePrice);

    pdp.header.changePriceMode('GROSS_MODE');
    pdp.getPrice().should('contain.text', productData.originalPrice);
  });
});
