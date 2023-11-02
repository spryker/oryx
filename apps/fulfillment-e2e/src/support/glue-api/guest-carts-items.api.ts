import { GlueApi } from './glue.api';

export class GuestCartsItemsApi extends GlueApi {
  postGuestCartsItems = (sku: string | undefined, quantity: number) => {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}/guest-cart-items`,
      headers: this.getHeaders(),
      body: {
        data: {
          type: 'guest-cart-items',
          attributes: {
            sku,
            quantity,
          },
        },
      },
      failOnStatusCode: false,
    });
  };
}
