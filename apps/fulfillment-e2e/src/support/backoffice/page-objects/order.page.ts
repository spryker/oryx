import { ABackofficePage } from './abstract-backoffice.page';

export class OrderPage extends ABackofficePage {
  url = '/sales/detail';
  orderId: string;

  constructor(orderId?: string) {
    super();

    if (orderId) {
      this.orderId = orderId;
      // don't ask me why replace is needed here...
      this.url += `?id-sales-order=${orderId.replace('DE--', '')}`;
    }
  }

  getOMSButtonByText = (text: string) => cy.contains('button', text);

  payForOrder = () => this.getOMSButtonByText('Pay').click();

  skipTimeout = () => this.getOMSButtonByText('Skip timeout').click();

  pickingListGenerationSchedule = () =>
    this.getOMSButtonByText('picking list generation schedule').click();

  prepareForPicking = () =>
    this.getOMSButtonByText('prepare for picking').click();
}
