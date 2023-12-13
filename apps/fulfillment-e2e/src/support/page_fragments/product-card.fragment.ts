export class ProductCardFragment {
  constructor(protected element: JQuery<HTMLElement>) {}

  getWrapper = () => cy.wrap(this.element);
  getDoneBtn = () => this.getWrapper().find('oryx-button');
  getIncreaseBtn = () => this.getWrapper().find('button[part="increase"]');
  getNumberOfItems = () => this.getWrapper().find('form div');

  pickAllItems = () => {
    this.getNumberOfItems().then((el) => {
      const number = parseInt(el.text().match(/\d+/)[0]);

      Cypress._.times(number, () => {
        this.getIncreaseBtn().click({ force: true });
      });
    });

    this.getDoneBtn().click();
  };

  pickOneItem = () => {
    this.getIncreaseBtn().click({ force: true });
    this.getDoneBtn().click();
  };
}
