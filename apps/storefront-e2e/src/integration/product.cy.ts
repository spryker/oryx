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

    cy.intercept('**/concrete-alternative-products?**').as(
      'product-relations-request'
    );
    pdp.visit();
    cy.wait('@product-relations-request');

    pdp.checkDefaultProduct();
    pdp.getRelations().getProducts().should('be.visible');
  });

  it('should proper change carousel and arrow visibility with navigation between slides using buttons', () => {
    const productData = ProductStorage.getByEq(3);
    const pdp = new ProductDetailsPage(productData);

    cy.intercept('**/catalog-search?category**').as('catalog-search');
    pdp.visit();
    cy.wait('@catalog-search');

    cy.log('initial state');
    pdp.getCarousel().getWrapper().scrollIntoView();
    pdp.getCarousel().getCard(0).should('be.visible');
    pdp.getCarousel().getCard(3).should('be.visible');
    pdp.getCarousel().getCard(4).should('not.be.visible');
    pdp.getCarousel().getButton('next').should('be.visible');
    pdp.getCarousel().getButton('previous').should('not.be.visible');

    cy.log('next slide');
    pdp.getCarousel().getButton('next').click();
    pdp.getCarousel().getCard(0).should('not.be.visible');
    pdp.getCarousel().getCard(4).should('be.visible');
    pdp.getCarousel().getCard(7).should('be.visible');
    pdp.getCarousel().getCard(8).should('not.be.visible');
    pdp.getCarousel().getButton('next').should('be.visible');
    pdp.getCarousel().getButton('previous').should('be.visible');

    cy.log('last slide');
    pdp.getCarousel().getButton('next').click();
    pdp.getCarousel().getCard(7).should('not.be.visible');
    pdp.getCarousel().getCard(8).should('be.visible');
    pdp.getCarousel().getButton('next').should('not.be.visible');
    pdp.getCarousel().getButton('previous').should('be.visible');

    cy.log('first slide');
    pdp.getCarousel().getButton('previous').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    pdp.getCarousel().getButton('previous').click();
    pdp.getCarousel().getCard(0).should('be.visible');
    pdp.getCarousel().getCard(3).should('be.visible');
    pdp.getCarousel().getCard(4).should('not.be.visible');
    pdp.getCarousel().getButton('next').should('be.visible');
    pdp.getCarousel().getButton('previous').should('not.be.visible');
  });

  it('should proper change carousel with navigation between slides using indicators', () => {
    const productData = ProductStorage.getByEq(3);
    const pdp = new ProductDetailsPage(productData);

    cy.intercept('**/catalog-search?category**').as('catalog-search');
    pdp.visit();
    cy.wait('@catalog-search');

    cy.log('initial state');
    pdp.getCarousel().getWrapper().scrollIntoView();
    pdp.getCarousel().getCard(0).should('be.visible');
    pdp.getCarousel().getCard(3).should('be.visible');
    pdp.getCarousel().getCard(4).should('not.be.visible');

    cy.log('next slide');
    pdp.getCarousel().getIndicator(2).click();
    pdp.getCarousel().getCard(0).should('not.be.visible');
    pdp.getCarousel().getCard(4).should('be.visible');
    pdp.getCarousel().getCard(7).should('be.visible');
    pdp.getCarousel().getCard(8).should('not.be.visible');

    cy.log('last slide');
    pdp.getCarousel().getIndicator('last-child').click();
    pdp.getCarousel().getCard(7).should('not.be.visible');
    pdp.getCarousel().getCard(8).should('be.visible');

    cy.log('first slide');
    pdp.getCarousel().getIndicator('first-child').click();
    pdp.getCarousel().getCard(0).should('be.visible');
    pdp.getCarousel().getCard(3).should('be.visible');
    pdp.getCarousel().getCard(4).should('not.be.visible');
  });

  it('should update prices when price mode changes', { tags: 'b2b' }, () => {
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
