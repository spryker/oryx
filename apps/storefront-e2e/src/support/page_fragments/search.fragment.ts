export class SearchFragment {
  getWrapper = () => cy.get('oryx-search-box');

  getPopover = () => this.getWrapper().find('oryx-popover');
  getTypeahead = () => this.getWrapper().find('oryx-typeahead');
  getInput = () => this.getWrapper().find('input[placeholder="Search"]');
  getIcon = () => this.getWrapper().find('oryx-icon').eq(0);
  getClearButton = () => this.getWrapper().find('.clear-button');
  getSearchResultsWrapper = () => this.getWrapper().find('[slot="option"]');
  getEmptySearchResults = () => this.getWrapper().find('[slot="empty"]');
  getSearchResultsContainer = () =>
    this.getWrapper().find('[slot="option"] div');
  getSearchSuggestions = () =>
    this.getSearchResultsWrapper().find(
      'section:first-of-type oryx-content-link'
    );

  getSearchProducts = () =>
    this.getSearchResultsWrapper().find('oryx-product-card');

  getViewAllBtn = () =>
    this.getSearchResultsWrapper().contains('View all products');

  search = (text: string) => {
    const encoded = encodeURIComponent(text).replace(/%20/g, '+');

    cy.hydrateElemenet('/assets/box.component-*.js', () => {
      this.getInput().click();
    });

    cy.intercept(`/catalog-search-suggestions?q=${encoded}*`).as('searchQuery');
    this.getInput().type(text);
    cy.wait('@searchQuery');

    // wait while open animation is over
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(125);
  };

  clearSearch = () => {
    this.getClearButton().click();
  };
}
