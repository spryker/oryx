import { ProductStorage } from '../data-storages/product.storage';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';

describe('Product details suite', () => {
  it('HRZ-771 | should open PDP with SSR', () => {
    const productData = ProductStorage.getProductByEq(0);
    const pdp = new ProductDetailsPage(productData);

    pdp.visit();

    pdp.getTitle().should('contain.text', productData.title);
    pdp.getRating().should('be.visible');
    pdp.getSKU().should('contain.text', productData.id);
    pdp.getPrice().should('contain.text', productData.originalPrice);

    pdp.getQuantityComponent().getInput().should('have.value', 1);
    pdp.getAddToCartBtn().should('be.visible').and('be.enabled');

    pdp.getImages().should('be.visible');
    pdp.getDescription().should('be.visible');
    pdp.getAttributes().should('have.length', 6);
  });
});
