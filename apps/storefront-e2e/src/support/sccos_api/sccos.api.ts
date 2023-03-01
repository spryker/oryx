import { Product } from '../../types/product.type';

export class SCCOSApi {
  private customerUniqueId: number = Math.random();
  private headers: object;
  private apiUrl: string;

  constructor() {
    cy.window().then((win) => {
      win.sessionStorage.setItem('anonymous-user', `${this.customerUniqueId}`);
    });

    this.headers = {
      'X-Anonymous-Customer-Unique-Id': this.customerUniqueId,
    };

    this.apiUrl = Cypress.env('SCOS_BASE_URL');
  }

  getGuestCarts = () => {
    cy.log('SCCOSApi | Create new guest cart');

    cy.request({
      method: 'GET',
      url: `${this.apiUrl}/guest-carts?include=guest-cart-items`,
      headers: this.headers,
    });
  };

  postGuestCartsItems = (productData: Product, quantity: number) => {
    const body = {
      data: {
        type: 'guest-cart-items',
        attributes: {
          sku: productData.id,
          quantity,
        },
      },
    };

    cy.log('SCCOSApi | Add items to the guest cart');

    cy.request({
      method: 'POST',
      url: `${this.apiUrl}/guest-cart-items?include=guest-cart-items`,
      headers: this.headers,
      body,
    });
  };
}
