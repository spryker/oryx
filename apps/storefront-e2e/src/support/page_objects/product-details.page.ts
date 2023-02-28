import { Product } from '../../interfaces/product.interface';
import { QuantityInputFragment } from '../page_fragments/quantity-input.fragment';
import { AbstractSFPage } from './abstract.page';

export class ProductDetailsPage extends AbstractSFPage {
  url = '/product/';
  productId: string;
  quantityInputComponent: QuantityInputFragment;

  constructor(productData: Product) {
    super();

    this.productId = productData.id;
    this.url += productData.id;
  }

  waitForLoaded(): void {
    cy.intercept(`**/concrete-products/${this.productId}?*`).as(
      'productRequest'
    );

    cy.wait('@productRequest');

    this.getQuantityComponent()
      .getInput()
      .should('be.visible')
      .and('be.enabled');
  }

  getContainer = () => cy.get('experience-composition[route="/product/:sku"]');

  getTitle = () =>
    this.getContainer()
      .find('oryx-product-title')
      .shadow()
      .find('oryx-heading');
  getRating = () => this.getContainer().find('oryx-product-average-rating');
  getSKU = () => this.getContainer().find('oryx-product-id').shadow();
  getPrice = () => this.getContainer().find('oryx-product-price').shadow();

  getQuantityComponent = () => {
    return this.quantityInputComponent
      ? this.quantityInputComponent
      : new QuantityInputFragment(
          this.getContainer().find('oryx-cart-quantity-input')
        );
  };

  getAddToCartBtn = () => this.getContainer().contains('Add to cart');

  getImages = () => this.getContainer().find('product-images');
  getDescription = () => this.getContainer().find('oryx-product-description');
  getAttributes = () =>
    this.getContainer().find('oryx-product-attributes').find('li');

  addItemsToTheCart = (numberOfItems = 1) => {
    if (numberOfItems === 1) {
      this.getAddToCartBtn().click();
    } else {
      throw new Error('Add multiple items to the Cart is not implemented yet.');
    }
  };
}
