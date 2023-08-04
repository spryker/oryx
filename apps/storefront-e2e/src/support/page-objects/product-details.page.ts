import { ProductRelationsFragment } from '../page-fragments/product-relations.fragment';
import { QuantityInputFragment } from '../page-fragments/quantity-input.fragment';
import { Product } from '../types/product.type';
import { AbstractSFPage } from './abstract.page';

export class ProductDetailsPage extends AbstractSFPage {
  url = '/product/';
  productData: Product;
  quantityInput: QuantityInputFragment;

  constructor(productData?: Product) {
    super();

    if (productData) {
      this.productData = productData;
      this.url += productData.id;
    }
  }

  beforeVisit(): void {
    cy.intercept(`/concrete-products/${this.productData.id}*`).as(
      'productRequest'
    );
  }

  waitForLoaded(): void {
    this.getQuantityComponent().getInput().should('be.visible');
    cy.wait('@productRequest');
  }

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
    this.getInfoWrapper()
      .find('oryx-product-price')
      .find('[part="sales"]')
      .shadow();
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
  getProductsList = () => cy.get('oryx-product-list');
  getAvailability = () => this.getWrapper().find('oryx-product-availability');

  addItemsToTheCart = (numberOfItems = 1, isHydrated = false) => {
    if (numberOfItems === 1) {
      if (!isHydrated) {
        cy.hydrateElemenet('/assets/cart-add-*.js', () => {
          this.getAddToCartBtn().click();
        });
      }

      cy.intercept({
        method: 'POST',
        url: /\/carts\/*\/items*|\/guest-cart-items*/,
      }).as('addToCartRequest');

      this.getAddToCartBtn().click();

      cy.wait('@addToCartRequest');

      // wait till loading animation is finished
      this.getAddToCartBtn().should('not.have.attr', 'loading');
      this.getAddToCartBtn().should('not.have.attr', 'confirmed');
    } else {
      throw new Error('Add multiple items to the Cart is not implemented yet.');
    }
  };

  checkDefaultProduct = () => {
    this.getImages().should('be.visible');
    this.getDescription().should('be.visible');
    this.getAttributeTerms().should('be.visible');

    this.getTitle().should('contain.text', this.productData.title);
    this.getRating().should('be.visible');
    this.getSKU().should('contain.text', this.productData.id);
    this.getPrice().should('contain.text', this.productData.originalPrice);

    this.getQuantityComponent().getInput().should('have.value', 1);
    this.getAddToCartBtn().should('be.visible');
    this.getAvailability().should('be.visible');

    this.getProductsList().should('be.visible');
  };
}
