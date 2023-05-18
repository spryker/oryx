export class FiltersFragment {
  getFilterButton = () => cy.get('oryx-picking-filter-button');
  getFilterButtonTrigger = () => this.getFilterButton().find('oryx-toggle-icon input');
  getFiltersModal = () => this.getFilterButton().find('oryx-picking-filters').find('oryx-modal'); 
}
