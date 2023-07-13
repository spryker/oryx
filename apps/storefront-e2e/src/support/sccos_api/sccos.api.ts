import { defaultAddress } from '../../test-data/default-address';
import { TestProductData } from '../../types/product.type';
import { TestCustomerData } from '../../types/user.type';

export type ApiResponse<T> = {
  data: T;
};

export type ApiArrayResponse<T> = {
  data: T[];
};

export type CartData = {
  id: string;
  attributes: {
    name: string;
  };
};

export class SCCOSApi {
  private anonymousHeader = 'X-Anonymous-Customer-Unique-Id';
  private customerUniqueId: number = Math.random();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private headers: any = {};
  private apiUrl: string;

  constructor() {
    cy.window().then((win) => {
      win.sessionStorage.setItem(
        'oryx.anonymous-user',
        `${this.customerUniqueId}`
      );
    });

    this.headers[this.anonymousHeader] = this.customerUniqueId;
    this.apiUrl = Cypress.env('SCOS_BASE_URL');
  }

  private removeAnonymousHeader = () => {
    delete this.headers[this.anonymousHeader];
  };

  private getAccessTokenFromStorage = (storage) => {
    const localStorage = storage[Cypress.config('baseUrl')] as {
      'oryx.oauth-token': string;
    };

    return JSON.parse(localStorage['oryx.oauth-token']).access_token;
  };

  private setAuthorizationHeader = (token) => {
    this.headers.authorization = `Bearer ${token}`;
  };

  private addAuthorizationHeaders = (storage) => {
    const token = this.getAccessTokenFromStorage(storage);

    this.setAuthorizationHeader(token);
    this.removeAnonymousHeader();
  };

  guestCarts = {
    get: () => {
      cy.log('SCCOSApi | Create new guest cart');

      cy.request({
        method: 'GET',
        url: `${this.apiUrl}/guest-carts?include=guest-cart-items`,
        headers: this.headers,
      });
    },
  };

  carts = {
    customersGet: (customerId: string) => {
      cy.log('SCCOSApi | Get carts for logged in user');

      return cy.getAllLocalStorage().then((storage) => {
        this.addAuthorizationHeaders(storage);

        return cy.request<ApiArrayResponse<CartData>>({
          method: 'GET',
          url: `${this.apiUrl}/customers/${customerId}/carts`,
          headers: this.headers,
        });
      });
    },
    post: (
      body = {
        data: {
          type: 'carts',
          attributes: {
            name: `Cart ${Date.now()}`,
            priceMode: 'GROSS_MODE',
            currency: 'EUR',
            store: 'DE',
          },
        },
      }
    ) => {
      cy.log('SCCOSApi | Create new cart for logged in user');

      return cy.getAllLocalStorage().then((storage) => {
        this.addAuthorizationHeaders(storage);

        return cy.request({
          method: 'POST',
          url: `${this.apiUrl}/carts`,
          headers: this.headers,
          body,
        });
      });
    },
    delete: (cartId: string) => {
      cy.log('SCCOSApi | Delete cart for logged in user');

      return cy.getAllLocalStorage().then((storage) => {
        this.addAuthorizationHeaders(storage);

        return cy.request({
          method: 'DELETE',
          url: `${this.apiUrl}/carts/${cartId}`,
          headers: this.headers,
          // some carts can't be deleted
          // but we don't want to fail tests in this case
          failOnStatusCode: false,
        });
      });
    },
  };

  guestCartItems = {
    post: (productData: TestProductData, quantity: number) => {
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
    },
  };

  cartItems = {
    post: (productData: TestProductData, quantity: number, cartId: string) => {
      const body = {
        data: {
          type: 'items',
          attributes: {
            sku: productData.id,
            quantity,
          },
        },
      };

      cy.log('SCCOSApi | Add items to customer cart');

      return cy.getAllLocalStorage().then((storage) => {
        this.addAuthorizationHeaders(storage);

        return cy.request({
          method: 'POST',
          url: `${this.apiUrl}/carts/${cartId}/items`,
          headers: this.headers,
          body,
        });
      });
    },
  };

  addresses = {
    get: (customerId: string) => {
      cy.log('SCCOSApi | Get customer addresses');

      return cy.getAllLocalStorage().then((storage) => {
        this.addAuthorizationHeaders(storage);

        return cy.request({
          method: 'GET',
          url: `${this.apiUrl}/customers/${customerId}/addresses`,
          headers: this.headers,
        });
      });
    },
    post: (customerId: string, addressData = {}) => {
      const body = {
        data: {
          type: 'addresses',
          attributes: { ...defaultAddress, ...addressData },
        },
      };

      cy.log('SCCOSApi | Create customer address');

      return cy.getAllLocalStorage().then((storage) => {
        this.addAuthorizationHeaders(storage);

        return cy.request({
          method: 'POST',
          url: `${this.apiUrl}/customers/${customerId}/addresses`,
          headers: this.headers,
          body,
        });
      });
    },
    delete: (customerId: string, addressId: string) => {
      cy.log('SCCOSApi | Delete customer address');

      return cy.getAllLocalStorage().then((storage) => {
        this.addAuthorizationHeaders(storage);

        return cy.request({
          method: 'DELETE',
          url: `${this.apiUrl}/customers/${customerId}/addresses/${addressId}`,
          headers: this.headers,
        });
      });
    },
  };

  token = {
    post: (user: TestCustomerData) => {
      cy.log('SCCOSApi | POST token');

      return cy.request({
        method: 'POST',
        url: `${this.apiUrl}/token`,
        headers: this.headers,
        form: true,
        body: {
          username: user.email,
          password: user.password,
          grant_type: 'password',
        },
      });
    },
  };
}
