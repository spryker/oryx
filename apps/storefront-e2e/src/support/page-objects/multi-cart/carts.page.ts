import { AbstractSFPage } from '../abstract.page';

export class CartsPage extends AbstractSFPage {
  url = '/my-account/carts';

  waitForLoaded(): void {
    this.getCartsList().should('exist');
  }

  getWrapper = () => cy.get('oryx-composition[uid="carts-page-content"]');
  getCreateCartButton = () =>
    this.getWrapper().find('a[href="/my-account/create-cart"]');
  getCartsList = () => this.getWrapper().find('oryx-cart-list');
  getCartByName = (name: string) =>
    this.getCartsList()
      .find('oryx-cart-list-item')
      .contains(name)
      .parents('oryx-cart-list-item');
  getRemoveCartButton = (name: string) =>
    this.getCartByName(name).find('oryx-cart-remove');
  getRemoveCartModal = (name: string) =>
    this.getRemoveCartButton(name).find('oryx-modal');
}
