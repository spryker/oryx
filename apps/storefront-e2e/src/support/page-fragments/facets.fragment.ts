export class FacetsFragment {
  getWrapper = () => cy.get('oryx-search-facet-navigation');
  getSearchFacets = () =>
    this.getWrapper().find(
      'oryx-search-facet, oryx-search-color-facet, oryx-search-facet-rating'
    );

  setTouchscreen = (value: 'Yes' | 'No') => {
    this.getWrapper()
      .find(`input[type="radio"][name="touchscreen"][value="${value}"]`)
      .check();
  };

  setBrand = (value: string) => {
    this.getWrapper()
      .find(`input[type="radio"][name="brand"][value="${value}"]`)
      .click();
  };

  resetBrand = () => {
    this.getWrapper()
      .contains('slot', 'Brand')
      .parent()
      .find('button[aria-label="Clear"]')
      .click();
  };

  setColor = (value: string) => {
    this.getWrapper()
      .find(`input[type="checkbox"][name="color"][value="${value}"]`)
      .check();
  };

  resetColor = () => {
    this.getWrapper()
      .find('oryx-search-color-facet')
      .find('button[aria-label="Clear"]')
      .click();
  };

  setRating = (value: string) => {
    this.getWrapper()
      .find(`input[type="radio"][name="rating"][value="${value}"]`)
      .check({force: true});
  };

  resetRating = () => {
    this.getWrapper()
      .find('oryx-search-facet-rating')
      .find('button[aria-label="Clear"]')
      .click();
  };

  setLabel = (value: string) => {
    this.getWrapper()
      .find(`input[type="checkbox"][name="label"][value="${value}"]`)
      .check();
  };

  resetLabel = () => {
    this.getWrapper()
      .contains('slot', 'Product Labels')
      .parent()
      .find('button[aria-label="Clear"]')
      .click();
  };
}
