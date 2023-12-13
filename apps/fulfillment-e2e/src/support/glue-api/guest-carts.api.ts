import { GlueApi } from './glue.api';

export class GuestCartsApi extends GlueApi {
  getGuestCarts = () => {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/guest-carts`,
      headers: this.getHeaders(),
      failOnStatusCode: false,
    });
  };
}
