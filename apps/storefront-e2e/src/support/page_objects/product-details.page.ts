import { TestProductData } from '../../types/product.type';
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

  waitForLoadedSSR(): void {
    this.getQuantityComponent()
      .getInput()
      .should('be.visible')
      .and('be.enabled');
  }

  waitForLoadedSPA(): void {
    this.waitForLoadedSSR();
  }

  hydrateAddToCart = () => {
    this.getQuantityComponent().getInput().click();
    // the only way to check for hydration now
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  };

  getWrapper = () => cy.get('experience-composition[route="/product/:sku"]');
  getDetailsWrapper = () =>
    this.getWrapper().find('oryx-layout[layout="list"]');
  getTitle = () =>
    this.getDetailsWrapper().find('oryx-product-title').find('oryx-heading');
  getRating = () =>
    this.getDetailsWrapper().find('oryx-product-average-rating');
  getSKU = () => this.getDetailsWrapper().find('oryx-product-id').shadow();
  getPrice = () =>
    this.getDetailsWrapper().find('oryx-product-price').find('[part="sales"]');
  getAddToCartWrapper = () => this.getDetailsWrapper().find('oryx-cart-add');

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

  addItemsToTheCart = (numberOfItems = 1) => {
    if (numberOfItems === 1) {
      this.getAddToCartBtn().click();
    } else {
      throw new Error('Add multiple items to the Cart is not implemented yet.');
    }
  };
}
