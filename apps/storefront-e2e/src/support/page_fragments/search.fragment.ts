export class SearchFragment {
  getWrapper = () => cy.get('oryx-search-box');

  getPopover = () => this.getWrapper().find('oryx-popover');
  getTypeahead = () => this.getWrapper().find('oryx-typeahead');
  getInput = () => this.getWrapper().find('input[placeholder="Search"]');
  getIcon = () => this.getWrapper().find('oryx-icon').eq(0);
  getClearButton = () => this.getWrapper().contains('Clear');
  getSearchResultsWrapper = () => this.getWrapper().find('[slot="option"]');
  getEmptySearchResults = () => this.getWrapper().find('[slot="empty"]');
  getSearchResultsContainer = () =>
    this.getWrapper().find('[slot="option"] div');
  getSearchSuggestions = () =>
    this.getSearchResultsWrapper().find('section:first-of-type li');

  getSearchProducts = () =>
    this.getSearchResultsWrapper().find('oryx-content-link.product');

  getViewAllBtn = () =>
    this.getSearchResultsWrapper().contains('View all products');

  search = (text: string) => {
    cy.intercept(
      `**/catalog-search-suggestions?q=${encodeURIComponent(text).replace(
        /%20/g,
        '+'
      )}*`
    ).as('searchQuery');

    this.getWrapper().click();
    this.getTypeahead().click();
    this.getWrapper().should('not.have.attr', 'defer-hydration');
    this.getTypeahead().should('not.have.attr', 'defer-hydration');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    this.getInput().type(text, { delay: 10, force: true });

    cy.wait('@searchQuery');
  };

  clearSearch = () => {
    this.getClearButton().click();
  };
}
