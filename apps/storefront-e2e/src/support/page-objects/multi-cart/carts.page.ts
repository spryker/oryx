import { CartEntryFragment } from '../page-fragments/cart-entry.fragment';
import { TotalsFragment } from '../page-fragments/totals.fragment';
import { AbstractSFPage } from '../abstract.page';

export class CartsPage extends AbstractSFPage {
  url = '/my-account/cart';

  waitForLoaded(): void {
    this.getCartsList().should('exist');
  }

  getWrapper = () => cy.get('oryx-composition[uid="carts-page-content"]');
  getCreateCartButton = () => this.getWrapper().find('a[href="/my-account/create-cart"]');
  getCartsList = () => this.getWrapper().find('oryx-cart-list');
 
}
