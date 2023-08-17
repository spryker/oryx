import { CategoryPage } from '../support/page-objects/category.page';

describe('Filtering on the Category page', () => {
  let categoryPage;
  beforeEach(() => {
    categoryPage = new CategoryPage({ id: '6' });
    cy.visit(categoryPage.url);
  });

  it('should open appropriate Category page', { tags: 'smoke' }, () => {
    cy.url().should('include', categoryPage.categoryId);
    categoryPage.getRadio('[value="6"]').should('be.checked');
  });

  it('should change products list when filters applied', () => {
    cy.get('input[type="checkbox"][name="color"][value="Silver"]').check();
    cy.get('oryx-chip').should('contain', '1');
    cy.get('oryx-checkbox span').should('contain', 2);
    cy.get('oryx-product-card').should('have.length', 2);
    cy.get('input[type="radio"][name="brand"][value="DELL"]').check();
    cy.get('input[type="radio"][name="brand"][value="DELL"]').should(
      'be.checked'
    );
    cy.get('oryx-product-card').should('have.length', 1);
    cy.get('oryx-heading').should('contain.text', 'DELL Inspiron 7359');
  });

  it('should change products list when category filter is cleared', () => {
    cy.get('input[type="checkbox"][name="color"][value="Silver"]').check();
    cy.get('oryx-chip').should('contain', '1');
    cy.get('oryx-checkbox span').should('contain', 2);
    cy.get('oryx-product-card').should('have.length', 2);
    cy.get('input[type="radio"][name="brand"][value="DELL"]').check();
    cy.get('input[type="radio"][name="brand"][value="DELL"]').should(
      'be.checked'
    );
    cy.get('oryx-product-card').should('have.length', 1);
    cy.get('oryx-search-facet').contains('Clear').click();
    cy.get('oryx-product-card').should('have.length', 2);
  });
});

describe('Sorting on the Category page', () => {
  const sortingOptions = [
    'rating',
    'name_asc',
    'name_desc',
    'price_asc',
    'price_desc',
    'popularity',
  ];
  const expectedSkuOrder = [
    ['216_123', '217_123', '215_123', 'cable-hdmi-1-1', 'cable-vga-1-1'],
    ['217_123', '215_123', 'cable-hdmi-1-1', '216_123', 'cable-vga-1-1'],
    ['cable-vga-1-1', '216_123', 'cable-hdmi-1-1', '215_123', '217_123'],
    ['cable-hdmi-1-1', 'cable-vga-1-1', '215_123', '216_123', '217_123'],
    ['217_123', '216_123', '215_123', 'cable-hdmi-1-1', 'cable-vga-1-1'],
    ['cable-vga-1-1', 'cable-hdmi-1-1', '215_123', '216_123', '217_123'],
  ];
  const defaultSortingOrder = [
    'cable-hdmi-1-1',
    'cable-vga-1-1',
    '216_123',
    '217_123',
    '215_123',
  ];

  let categoryPage;
  beforeEach(() => {
    categoryPage = new CategoryPage({ id: '15' });
    cy.visit(categoryPage.url);
  });

  it('default sorting applied even after clearing the sort parameter', () => {
    cy.intercept('GET', '**/catalog-search?*').as('catalog-search');
    cy.wait('@catalog-search', { timeout: 5000 });
    // Wait till JS build the template
    // TODO Refactor cy.wait into understandable variable
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    cy.get('oryx-product-card').each((card, cardIndex) => {
      cy.wrap(card).should('have.attr', 'sku', defaultSortingOrder[cardIndex]);
    });
    // Checking that sorted by name ascending
    categoryPage.getProductSort().click();
    cy.intercept('GET', '**/catalog-search?*').as('catalog-search');
    cy.get(`oryx-option[value="${sortingOptions[1]}"]`).click();
    cy.wait('@catalog-search', { timeout: 5000 });
    // Wait till JS build the template
    // TODO Refactor cy.wait into understandable variable
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    cy.get('oryx-product-card').each((card, cardIndex) => {
      cy.wrap(card).should('have.attr', 'sku', expectedSkuOrder[1][cardIndex]);
    });
    // Checking that after clear default order applied
    cy.get('oryx-select')
      .find('oryx-icon[type="delete_forever"]')
      .trigger('mouseover')
      .click();
    cy.intercept('GET', '**/catalog-search?*').as('catalog-search');
    cy.wait('@catalog-search', { timeout: 5000 });
    // Wait till JS build the template
    // TODO Refactor cy.wait into understandable variable
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    cy.get('oryx-product-card').each((card, cardIndex) => {
      cy.wrap(card).should('have.attr', 'sku', defaultSortingOrder[cardIndex]);
    });
  });

  // Checks sorting through the all sorting options
  sortingOptions.forEach((option, index) => {
    it(`should sort products by ${option}`, () => {
      const expectedSku = expectedSkuOrder[index];
      categoryPage.getProductSort().click();
      cy.intercept('GET', '**/catalog-search?*').as('catalog-search');
      cy.get(`oryx-option[value="${option}"]`).click();
      cy.wait('@catalog-search', { timeout: 5000 });
      // Wait till JS build the template
      // TODO Refactor cy.wait into understandable variable
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(200);
      cy.get('oryx-product-card').each((card, cardIndex) => {
        cy.wrap(card).should('have.attr', 'sku', expectedSku[cardIndex]);
      });
    });
  });
});
