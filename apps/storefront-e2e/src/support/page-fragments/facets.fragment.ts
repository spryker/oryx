import { RangeFacetValues } from '../types/facet.types';

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

  getPriceFacetInput = (isMax = false) =>
    this.getPriceFacet().find(`oryx-input:nth-of-type(${isMax ? 2 : 1}) input`);
  getPriceFacetRange = (isMax = false) =>
    this.getPriceFacet()
      .find('oryx-multi-range')
      .find(`input:nth-of-type(${isMax ? 2 : 1})`);

  setPriceFacetValues = (values: RangeFacetValues) => {
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'max' || key === 'min') {
        this.getPriceFacetInput(key === 'max').then((input) => {
          //apply value and emit Enter key down to simulate interaction
          input.val = value;
          input.trigger('keydown', { key: 'Enter' });
        });
      }

      if (key === 'maxValue' || key === 'minValue') {
        this.getPriceFacetRange(key === 'maxValue').then((input) => {
          //apply value and emit change event to simulate interaction
          input.val = value;
          input.trigger('change');
        });
      }
    });
  };

  validatePriceFacetValues = (values: RangeFacetValues) => {
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'max' || key === 'min') {
        this.getPriceFacetInput(key === 'max')
          .invoke('attr', 'value')
          .should('eq', value);
      }

      if (key === 'maxValue' || key === 'minValue') {
        this.getPriceFacetRange(key === 'maxValue')
          .invoke('attr', 'value')
          .should('eq', value);
      }
    });
  };
}
