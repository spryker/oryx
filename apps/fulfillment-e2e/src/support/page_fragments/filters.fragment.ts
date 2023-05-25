export class FiltersFragment {
  getFilterButton = () => cy.get('oryx-picking-filter-button');
  getFilterButtonTrigger = () =>
    this.getFilterButton().find('oryx-toggle-icon input');
  getFiltersModal = () =>
    this.getFilterButton().find('oryx-picking-filters').find('oryx-modal');
  getFiltersReset = () =>
    this.getFilterButton()
      .find('oryx-picking-filters')
      .find('[slot="navigate-back"] button');
  getFiltersClose = () =>
    this.getFiltersModal().find(
      'header oryx-icon-button button[value="cancel"]'
    );
  getFiltersApply = () =>
    this.getFilterButton()
      .find('oryx-picking-filters')
      .find('oryx-button[slot="footer"] button');
}
