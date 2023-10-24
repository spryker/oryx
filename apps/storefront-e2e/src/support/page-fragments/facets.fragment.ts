export class FacetsFragment {
  getWrapper = () => cy.get('oryx-search-facet-navigation');
  getSearchFacets = () => cy.get('oryx-search-facet, oryx-search-color-facet');

  setTouchscreen = (value: 'Yes' | 'No') => {
    cy.get(`input[type="radio"][name="touchscreen"][value="${value}"]`).check();
  };

  setBrand = (value: string) => {
    cy.get(`input[type="radio"][name="brand"][value="${value}"]`).click();
  };

  resetBrand = () => {
    cy.contains('slot', 'Brand')
      .parent()
      .find('button[aria-label="Clear"]')
      .click();
  };

  setColor = (value: string) => {
    cy.get(`input[type="checkbox"][name="color"][value="${value}"]`).check();
  };

  resetColor = () => {
    cy.get('oryx-search-color-facet')
      .find('button[aria-label="Clear"]')
      .click();
  };

  getPriceFacet = () => cy.get('oryx-search-price-facet');

  setMinPrice = (price: number) =>
    this.getPriceFacet()
      .find('oryx-input:nth-of-type(1) input')
      .clear()
      .type(`${price}{enter}`);

  setMaxPrice = (price: number) =>
    this.getPriceFacet()
      .find('oryx-input:nth-of-type(2) input')
      .clear()
      .type(`${price}{enter}`);

  setMinPriceRange = (price: number) =>
    this.getPriceFacet()
      .find('oryx-multi-range')
      .find(`label:nth-of-type(1) input`)
      .invoke('val', price)
      .trigger('input', { force: true })
      .trigger('change', { force: true });

  setMaxPriceRange = (price: number) =>
    this.getPriceFacet()
      .find('oryx-multi-range')
      .find(`label:nth-of-type(2) input`)
      .invoke('val', price)
      .trigger('input', { force: true })
      .trigger('change', { force: true });

  resetPrices = () =>
    this.getPriceFacet()
      .find('button[aria-label="Clear"]')
      .click({ force: true });
}
