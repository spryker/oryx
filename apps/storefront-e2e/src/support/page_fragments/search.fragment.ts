export class SearchFragment {
  getWrapper = () => cy.get('search-box');

  getPopover = () => this.getWrapper().find('oryx-popover');
  getTypeahead = () => this.getWrapper().find('oryx-typeahead');
  getInput = () => this.getWrapper().find('input[placeholder="Search"]');
  getIcon = () => this.getWrapper().find('oryx-icon').eq(0);
  getClearButton = () => this.getWrapper().contains('Clear');
  getSearchResultsWrapper = () => this.getWrapper().find('[slot="option"]');
  getEmptySearchResults = () => this.getWrapper().find('[slot="empty"]');

  getSearchSuggestions = () =>
    this.getSearchResultsWrapper().find('section:first-of-type li');

  getSearchProducts = () =>
    this.getSearchResultsWrapper().find('oryx-content-link.product');

  getViewAllBtn = () =>
    this.getSearchResultsWrapper().contains('View all products');

  search = (text: string) => {
    cy.intercept(
      `**/catalog-search-suggestions?q=${encodeURIComponent(text)}*`
    ).as('searchQuery');

    this.getWrapper().trigger('focusin');
    cy.waitUpdateComplete(this.getTypeahead()).should('be.true');

    this.getInput().type(text, { delay: 100 });

    cy.wait('@searchQuery');
  };

  clearSearch = () => {
    this.getClearButton().click();
  };
}
