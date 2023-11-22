export class FacetsFragment {
  getWrapper = () => cy.get('oryx-search-facet-navigation');
  getSearchFacets = () =>
    this.getWrapper().find(
      'oryx-search-facet, oryx-search-color-facet, oryx-search-facet-rating'
    );

  setTouchscreen = (value: 'Yes' | 'No') => {
    this.getWrapper()
      .find(`input[type="radio"][name="touchscreen"][value="${value}"]`)
      .check({ force: true });
  };

  setBrand = (value: string) => {
    this.getWrapper()
      .find(`input[type="radio"][name="brand"][value="${value}"]`)
      .click({ force: true });
  };

  resetBrand = () => {
    this.getWrapper()
      .contains('slot', 'Brand')
      .parent()
      .find('button[aria-label="Clear"]')
      .click({ force: true });
  };

  setColor = (value: string) => {
    this.getWrapper()
      .find(`input[type="checkbox"][name="color"][value="${value}"]`)
      .check({ force: true });
  };

  resetColor = () => {
    this.getWrapper()
      .find('oryx-search-color-facet')
      .find('button[aria-label="Clear"]')
      .click({ force: true });
  };

  setRating = (value: string) => {
    this.getWrapper()
      .find(`input[type="radio"][name="rating"][value="${value}"]`)
      .check({ force: true });
  };

  resetRating = () => {
    this.getWrapper()
      .find('oryx-search-facet-rating')
      .find('button[aria-label="Clear"]')
      .click({ force: true });
  };

  setLabel = (value: string) => {
    this.getWrapper()
      .find(`input[type="checkbox"][name="label"][value="${value}"]`)
      .check({ force: true });
  };

  resetLabel = () => {
    this.getWrapper()
      .contains('slot', 'Product Labels')
      .parent()
      .find('button[aria-label="Clear"]')
      .click({ force: true });
  };

  getPriceFacet = () => cy.get('oryx-search-price-facet');

  setMinPrice = (price: number) => {
    this.getPriceFacet()
      .should('be.visible')
      .find('oryx-input:nth-of-type(1) input')
      .clear({ force: true })
      .type(`${price}{enter}`);
  };

  setMaxPrice = (price: number) =>
    this.getPriceFacet()
      .should('be.visible')
      .find('oryx-input:nth-of-type(2) input')
      .clear({ force: true })
      .type(`${price}{enter}`);

  setMinPriceRange = (price: number) =>
    this.getPriceFacet()
      .should('be.visible')
      .find('oryx-multi-range')
      .find(`label:nth-of-type(1) input`)
      .invoke('val', price)
      .trigger('input', { force: true })
      .trigger('change', { force: true });

  setMaxPriceRange = (price: number) =>
    this.getPriceFacet()
      .should('be.visible')
      .find('oryx-multi-range')
      .find(`label:nth-of-type(2) input`)
      .invoke('val', price)
      .trigger('input', { force: true })
      .trigger('change', { force: true });

  resetPrices = () =>
    this.getPriceFacet()
      .should('be.visible')
      .find('button[aria-label="Clear"]')
      .click({ force: true });
}
