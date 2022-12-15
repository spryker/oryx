import { Include, JsonApiModel } from '@spryker-oryx/utilities';

export module ApiCheckoutModel {
  export interface Attributes {
    // TODO: Uncomment when type from BE will be ready.
    // shipments: unknown[];
    addresses: unknown[];
    paymentProviders: unknown[];
    shipmentMethods: unknown[];
    selectedShipmentMethods: unknown[];
    selectedPaymentMethods: unknown[];
  }

  export interface PaymentMethod {
    id: string;
    paymentMethodName: string;
    paymentProviderName: string;
    priority?: number;
    requiredRequestData?: string[];
  }

  export interface ShipmentMethod {
    carrierName: string;
    currencyIsoCode: string;
    deliveryTime: number | null;
    id: number | string;
    name: string;
    price: number;
    taxRate?: string;
  }

  export interface CheckoutDataPayload {
    type: 'checkout-data';
    attributes?: {
      idCart: string;
      addresses?: unknown[];
      paymentProviders?: unknown[];
      selectedShipmentMethods?: unknown[];
      selectedPaymentMethods?: unknown[];
      shipments?: Shipment[];
      shipmentMethods?: ShipmentMethod[];
      shipment?: {
        idShipmentMethod: number;
      };
    };
  }

  export interface CheckoutPayload {
    type: 'checkout';
    attributes: {
      customer?: unknown;
      idCart: string;
      billingAddress?: Address;
      shippingAddress?: Address;
      shipments?: Shipment[];
      shipment?: {
        idShipmentMethod: 0;
      };
      payments?: PaymentMethod[];
    };
  }

  export interface Address {
    address1: string | null;
    address2: string | null;
    address3?: string | null;
    city: string | null;
    company?: string | null;
    country: string | null;
    firstName: string | null;
    lastName: string | null;
    id?: string | null;
    idCompanyBusinessUnitAddress?: string | null;
    isDefaultBilling?: boolean | null;
    isDefaultShipping?: boolean | null;
    iso2Code: string | null;
    phone?: string | null;
    salutation: string | null;
    zipCode: string | null;
  }

  export interface Shipment {
    items?: string[];
    requestedDeliveryDate?: string | null;
    selectedShipmentMethod?: ShipmentMethod;
    shippingAddress?: Address;
  }

  export enum Includes {
    Shipments = 'shipments',
    ShipmentMethods = 'shipment-methods',
    Addresses = 'addresses',
    PaymentMethods = 'payment-methods',
  }

  export type ResponseIncludes =
    | Include<Includes.Shipments, Shipment>
    | Include<Includes.ShipmentMethods, ShipmentMethod>
    | Include<Includes.Addresses, Address>
    | Include<Includes.PaymentMethods, PaymentMethod>;

  export type Response = JsonApiModel<Attributes, ResponseIncludes[]>;
}
