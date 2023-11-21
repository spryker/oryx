export class ListsHeaderFragment {
  getWrapper = () => cy.get('oryx-picking-lists-header');
  getSearch = () => this.getWrapper().find('oryx-search');
  getHeadline = () => this.getWrapper().find('oryx-heading');
  getSearchIcon = () => this.getSearch().find('oryx-icon[type="search"]');
  getSearchInput = () => this.getSearch().find('input[placeholder="Order ID"]');
  getSearchBackButton = () => this.getSearch().find('.back-button');
  getSearchClearButton = () => this.getSearch().find('.clear-button');
  getUserIcon = () => this.getWrapper().find('oryx-site-navigation-item');
  getTitle = () => this.getWrapper().find('oryx-heading');

  openSearch = () => this.getSearch().click();
}
