import { AbstractSFPage } from '../abstract.page';

export class EditCartPage extends AbstractSFPage {
  // TODO: provide url for edit cart page when it is done
  url = '';

  waitForLoaded(): void {
    this.getCartNameInput().should('exist');
  }

  getWrapper = () => cy.get('oryx-cart-edit');
  getCartNameInput = () => this.getWrapper().find('input[name="name"]');
  getCartCurrencyField = () =>
    this.getWrapper().find('select[name="currency"]');
  getCartPriceModeField = () =>
    this.getWrapper().find('select[name="priceMode"]');
  getSubmitButton = () => this.getWrapper().find('oryx-button').find('button');
}
