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
    cy.intercept(
      `**/catalog-search-suggestions?q=${encodeURIComponent(text).replace(
        /%20/g,
        '+'
      )}*`
    ).as('searchQuery');

    // trigger hydration
    this.getTypeahead().click();
    // wait for hydration
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    this.getInput().type(text, { delay: 10, force: true });

    cy.wait('@searchQuery');

    // wait while open animation is over
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  };

  clearSearch = () => {
    this.getClearButton().click();
  };
}
