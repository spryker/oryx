import { TestProductData } from '../../types/product.type';
import { ProductRelationsFragment } from '../page_fragments/product-relations.fragment';
import { QuantityInputFragment } from '../page_fragments/quantity-input.fragment';
import { AbstractSFPage } from './abstract.page';

export class ProductDetailsPage extends AbstractSFPage {
  url = '/product/';
  productId: string;
  quantityInput: QuantityInputFragment;

  constructor(productData?: TestProductData) {
    super();

    if (productData) {
      this.productId = productData.id;
      this.url += productData.id;
    }
  }

  waitForLoaded(): void {
    this.getQuantityComponent().getInput().should('be.visible');
  }

  hydrateAddToCart = () => {
    this.getQuantityComponent().getInput().click();
    // the only way to check for hydration now
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  };

  getWrapper = () => cy.get('oryx-composition[route="/product/:sku"]');
  getDetailsWrapper = () =>
    this.getWrapper().find('oryx-composition:first-child');
  getInfoWrapper = () =>
    this.getWrapper().find('oryx-composition:nth-child(2)');
  getTitle = () =>
    this.getInfoWrapper().find('oryx-product-title').find('oryx-heading');
  getRating = () => this.getInfoWrapper().find('oryx-product-average-rating');
  getSKU = () => this.getInfoWrapper().find('oryx-product-id').shadow();
  getPrice = () =>
    this.getInfoWrapper().find('oryx-product-price').find('[part="sales"]');
  getAddToCartWrapper = () => this.getInfoWrapper().find('oryx-cart-add');

  getQuantityComponent = () => {
    return this.quantityInput
      ? this.quantityInput
      : new QuantityInputFragment(
          this.getAddToCartWrapper().find('oryx-cart-quantity-input')
        );
  };

  getAddToCartBtn = () => this.getAddToCartWrapper().find('oryx-button');
  getImages = () => this.getWrapper().find('oryx-product-media');
  getDescription = () => this.getWrapper().find('oryx-product-description');
  getDescriptionText = () => this.getDescription().find('p');
  getAttributeTerms = () =>
    this.getWrapper().find('oryx-product-attributes').find('dt');

  getRelations = () => new ProductRelationsFragment();
  getAvailability = () => this.getWrapper().find('oryx-product-availability');

  addItemsToTheCart = (numberOfItems = 1) => {
    if (numberOfItems === 1) {
      cy.intercept({
        method: 'POST',
        url: /\/carts\/*\/items*|\/guest-cart-items*/,
      }).as('addToCartRequest');

      this.getAddToCartBtn().click();

      cy.wait('@addToCartRequest');
    } else {
      throw new Error('Add multiple items to the Cart is not implemented yet.');
    }
  };
}
