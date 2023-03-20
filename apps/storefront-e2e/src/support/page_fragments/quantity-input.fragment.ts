export class QuantityInputFragment {
  wrapper: Cypress.Chainable<JQuery<HTMLElement>>;

  constructor(wrapper: Cypress.Chainable<JQuery<HTMLElement>>) {
    this.wrapper = wrapper;
  }

  getWrapper = () => this.wrapper;

  getDecreaseBtn = () => this.getWrapper().find('[part="decrease"]');
  getInput = () =>
    this.getWrapper().find('oryx-input').find('input[type="number"]');
  getIncreaseBtn = () => this.getWrapper().find('[part="increase"]');

  decrease = () => this.getDecreaseBtn().click();
  increase = () => this.getIncreaseBtn().click();
}
