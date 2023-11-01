import { GlueApi } from './glue.api';

export class CheckoutApi extends GlueApi {
  checkout = (idCart: string) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('glueApiUrl')}/checkout?include=orders`,
      headers: this.getHeaders(),
      body: {
        data: {
          type: 'checkout',
          attributes: {
            shippingAddress: {
              iso2Code: 'AT',
              salutation: 'Mr',
              firstName: 'Sonia',
              lastName: 'Test',
              company: 'Test company',
              address1: 'Addr 1',
              address2: 'addr 2',
              zipCode: 'Zip123',
              city: 'Test city',
              phone: '1234567890',
            },
            shipment: {
              idShipmentMethod: '1',
            },
            customer: {
              email: 'andrew@ottom.de',
              salutation: 'Mr',
              firstName: 'Sonia',
              lastName: 'Test',
            },
            billingAddress: {
              iso2Code: 'AT',
              salutation: 'Mr',
              firstName: 'Sonia',
              lastName: 'Test',
              company: 'Test company',
              address1: 'Addr 1',
              address2: 'addr 2',
              zipCode: 'Zip123',
              city: 'Test city',
              phone: '1234567890',
            },
            idCart: idCart,
            payments: [
              {
                priority: 1,
                requiredRequestData: [
                  'paymentMethod',
                  'paymentProvider',
                  'dummyPaymentInvoice.dateOfBirth',
                ],
                id: '1',
                paymentMethodName: 'Invoice',
                paymentProviderName: 'DummyPayment',
              },
            ],
          },
        },
      },
      failOnStatusCode: false,
    });
  };
}
