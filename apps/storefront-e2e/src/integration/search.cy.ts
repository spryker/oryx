import { SearchPage } from '../support/page-objects/search.page';

describe('Filtering on the Search page', () => {
  let searchPage;
  beforeEach(() => {
    searchPage = new SearchPage({ q: 'TomTom' });
    cy.visit(searchPage.url);
  });
  it('should open appropriate Search page', { tags: 'smoke' }, () => {
    cy.url().should('include', searchPage.queryParameter);
    cy.get('oryx-heading').should('contain.text', 'TomTom');
  });
  it('should change products list when filters applied', () => {
    cy.get('input[type="radio"][name="touchscreen"][value="Yes"]').check();
    cy.get('oryx-chip').should('contain', '1');
    cy.get('input[type="radio"][name="touchscreen"][value="Yes"]').should(
      'be.checked'
    );
    cy.get('oryx-radio span').should('contain', 3);
    searchPage.getProductCard().should('have.length', 3);
    cy.get('input[type="checkbox"][name="color"][value="Black"]').check();
    cy.get('input[type="checkbox"][name="color"][value="Black"]').should(
      'be.checked'
    );
    searchPage.getProductCard().should('have.length', 1);
    cy.get('oryx-heading').should('contain.text', 'TomTom');
  });
  it('should change products list when category filter is cleared', () => {
    searchPage.getProductCard().should('have.length', 10);
    cy.get('input[type="radio"][name="touchscreen"][value="Yes"]').check();
    cy.get('input[type="radio"][name="touchscreen"][value="Yes"]').should(
      'be.checked'
    );
    cy.get('oryx-radio span').should('contain', 3);
    searchPage.getProductCard().should('have.length', 3);
    searchPage.getFacet().contains('Clear').click();
    searchPage.getProductCard().should('have.length', 10);
  });
});

describe('Sorting on the Search page', () => {
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

  let searchPage;
  beforeEach(() => {
    searchPage = new SearchPage({ q: 'Cable' });
    cy.visit(searchPage.url);
  });
  it('default sorting applied even after clearing the sort parameter', () => {
    cy.intercept('GET', '**/catalog-search?*').as('catalog-search');
    cy.wait('@catalog-search', { timeout: 5000 });
    // Wait till JS build the template
    // TODO Refactor cy.wait into understandable variable
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    searchPage.getProductCard().each((card, cardIndex) => {
      cy.wrap(card).should('have.attr', 'sku', defaultSortingOrder[cardIndex]);
    });
    // Checking that sorted by name ascending
    searchPage.getProductSort().click();
    cy.intercept('GET', '**/catalog-search?*').as('catalog-search');
    cy.get(`oryx-option[value="${sortingOptions[1]}"]`).click();
    cy.wait('@catalog-search', { timeout: 5000 });
    // Wait till JS build the template
    // TODO Refactor cy.wait into understandable variable
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    searchPage.getProductCard().each((card, cardIndex) => {
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
    searchPage.getProductCard().each((card, cardIndex) => {
      cy.wrap(card).should('have.attr', 'sku', defaultSortingOrder[cardIndex]);
    });
  });
  // Checks sorting through the all sorting options
  sortingOptions.forEach((option, index) => {
    it(`should sort products by ${option}`, () => {
      const expectedSku = expectedSkuOrder[index];
      searchPage.getProductSort().click();
      cy.intercept('GET', '**/catalog-search?*').as('catalog-search');
      cy.get(`oryx-option[value="${option}"]`).click();
      cy.wait('@catalog-search', { timeout: 5000 });
      // Wait till JS build the template
      // TODO Refactor cy.wait into understandable variable
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(200);
      searchPage.getProductCard().each((card, cardIndex) => {
        cy.wrap(card).should('have.attr', 'sku', expectedSku[cardIndex]);
      });
    });
  });
});
