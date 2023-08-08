import { CartEntryFragment } from '../page-fragments/cart-entry.fragment';
import { TotalsFragment } from '../page-fragments/totals.fragment';
import { AbstractSFPage } from './abstract.page';

export class ThankYouPage extends AbstractSFPage {
  url: string;

  orderTotalsFragment: TotalsFragment;

  constructor(orderId: string) {
    super();

    this.url = `/order/${orderId}`;
    this.orderTotalsFragment = new TotalsFragment('oryx-order-totals');
  }

  waitForLoaded(): void {
    this.getHeading().should('be.visible');
  }

  getHeading = () => cy.contains('Thank you');
  getConfirmationBanner = () => cy.get('oryx-order-confirmation-banner');
  getConfirmationBannerText = () => this.getConfirmationBanner().find('p');
  getOrderSummary = () => cy.get('oryx-order-summary');
  getOrderEntriesWrapper = () => cy.get('oryx-order-entries');
  getOrderEntries = () =>
    this.getOrderEntriesWrapper()
      .find('oryx-cart-entry')
      .then(($elements) => {
        return cy.wrap(
          $elements.toArray().map(($el) => new CartEntryFragment($el))
        );
      });
  getOrderDetails = () => this.getOrderSummary().find('section');
}
