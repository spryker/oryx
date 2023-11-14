import { AFAPage } from './abstract-fa.page';

export class WarehouseSelectionPage extends AFAPage {
  url = '/warehouse-selection';

  constructor() {
    super();
    cy.intercept('GET', '**/warehouse-user-assignments').as(
      'warehouse-user-assignments'
    );
  }

  waitForLoaded = () => {
    cy.wait('@warehouse-user-assignments');
  };

  getWrapper = () => cy.get('.warehouses-list');
  getTitle = () => this.getWrapper().find('oryx-heading h1');
  getNames = () => this.getWrapper().find('oryx-heading h3');
  getSelectBtns = () => this.getWrapper().find('oryx-button');

  selectByEq = (eq: number) => {
    this.getSelectBtns().eq(eq).click();
  };

  selectByName = (name: string) => {
    this.getNames()
      .contains(name)
      .parent('oryx-heading')
      .next('oryx-button')
      .click();
  };
}
