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
}
