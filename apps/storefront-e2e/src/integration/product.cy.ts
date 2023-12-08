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

  it.only('should proper change carousel with navigation between slides using buttons', () => {
    const productData = ProductStorage.getByEq(3);
    const pdp = new ProductDetailsPage(productData);

    cy.intercept('**/catalog-search?category**').as('catalog-search');
    pdp.visit();
    cy.wait('@catalog-search');

    cy.log('initial state');
    // removed all waits and replaced them with .scrollIntoView() call
    // it will scroll the carousel into view and will make elements visible
    pdp.getCarousel().getWrapper().scrollIntoView();
    pdp.getCarousel().getButton('next').should('be.visible');
    pdp.getCarousel().getButton('previous').should('not.be.visible');

    cy.log('next slide');
    pdp.getCarousel().getButton('next').click();
    pdp.getCarousel().getButton('next').should('be.visible');
    pdp.getCarousel().getButton('previous').should('be.visible');

    cy.log('last slide');
    pdp.getCarousel().getButton('next').click();
    pdp.getCarousel().getButton('next').should('not.be.visible');
    pdp.getCarousel().getButton('previous').should('be.visible');

    cy.log('first slide');
    pdp.getCarousel().getButton('previous').click();
    pdp.getCarousel().getButton('previous').click();
    pdp.getCarousel().getButton('next').should('be.visible');
    pdp.getCarousel().getButton('previous').should('not.be.visible');
  });

  // We should check CSS properties in E2E tests because
  // this is a UI implementation detait which might change
  // probably, it should be covered in unit tests
  xit('should proper change carousel with navigation between slides using indicators', () => {
    const productData = ProductStorage.getByEq(3);
    const pdp = new ProductDetailsPage(productData);
    const animationTime = 700;

    cy.intercept('**/catalog-search?category**').as('catalog-search');
    pdp.visit();
    cy.wait('@catalog-search');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(7000);

    cy.log('initial state');
    pdp
      .getCarousel()
      .getIndicator('first-child')
      .should('have.attr', 'style', '--opacity: 1;');
    pdp
      .getCarousel()
      .getIndicator(2)
      .should('have.attr', 'style', '--opacity: 0;');

    cy.log('next slide');
    pdp.getCarousel().getIndicator(2).click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(animationTime);
    pdp
      .getCarousel()
      .getIndicator('first-child')
      .invoke('attr', 'style')
      .then((value) => {
        const opacity = value.replace('--opacity: ', '').replace(';', '');
        expect(Number(opacity) < 0.2).true;
      });
    pdp
      .getCarousel()
      .getIndicator(2)
      .invoke('attr', 'style')
      .then((value) => {
        const opacity = value.replace('--opacity: ', '').replace(';', '');
        expect(Number(opacity) > 0.8).true;
      });
    pdp.getCarousel().getButton('next').should('be.visible');
    pdp.getCarousel().getButton('previous').should('be.visible');

    cy.log('last slide');
    pdp.getCarousel().getIndicator('last-child').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(animationTime);
    pdp
      .getCarousel()
      .getIndicator(2)
      .invoke('attr', 'style')
      .then((value) => {
        const opacity = value.replace('--opacity: ', '').replace(';', '');
        expect(Number(opacity) < 0.2).true;
      });
    pdp
      .getCarousel()
      .getIndicator('last-child')
      .invoke('attr', 'style')
      .then((value) => {
        const opacity = value.replace('--opacity: ', '').replace(';', '');
        expect(Number(opacity) > 0.8).true;
      });
    pdp.getCarousel().getButton('next').should('not.be.visible');
    pdp.getCarousel().getButton('previous').should('be.visible');

    cy.log('first slide');
    pdp.getCarousel().getIndicator('first-child').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(animationTime);
    pdp
      .getCarousel()
      .getIndicator('last-child')
      .invoke('attr', 'style')
      .then((value) => {
        const opacity = value.replace('--opacity: ', '').replace(';', '');
        expect(Number(opacity) < 0.2).true;
      });
    pdp
      .getCarousel()
      .getIndicator('first-child')
      .invoke('attr', 'style')
      .then((value) => {
        const opacity = value.replace('--opacity: ', '').replace(';', '');
        expect(Number(opacity) > 0.8).true;
      });
    pdp.getCarousel().getButton('next').should('be.visible');
    pdp.getCarousel().getButton('previous').should('not.be.visible');
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
