import { OrderData } from './order.model';

export interface CheckoutData {
  addresses?: unknown[];
  paymentProviders?: unknown[];
  selectedShipmentMethods?: unknown[];
  selectedPaymentMethods?: unknown[];
  paymentMethods?: PaymentMethod[];
  shipments?: Shipment[];
  carriers?: Carrier[];
  shipment?: {
    idShipmentMethod: number;
  };
}

export interface Checkout {
  customer: ContactDetails;
  cartId: string;
  billingAddress: Address;
  shippingAddress?: Address;
  shipments?: Shipment[];
  shipment?: {
    idShipmentMethod: number;
  };
  payments?: PaymentMethod[];
}

export interface Carrier {
  name?: string;
  shipmentMethods: ShipmentMethod[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
  priority?: number;
  /*
   * An array of attributes required by the given method to effectuate a purchase. The exact attribute list depends on the specific provider.
   */
  requiredRequestData?: string[];
}

export interface ShipmentMethod {
  deliveryTime: number | null;
  carrierName: string;
  currencyIsoCode: string;
  name: string;
  price: number;
  id: number | string;
}

export interface Address {
  id?: string | null;
  address1: string | null;
  address2: string | null;
  address3?: string | null;
  city: string | null;
  company?: string | null;
  country: string | null;
  firstName: string | null;
  lastName: string | null;
  idCompanyBusinessUnitAddress?: string | null;
  iso2Code: string | null;
  phone?: string | null;
  salutation: string | null;
  zipCode: string | null;
}

export interface Shipment {
  items?: string[];
  requestedDeliveryDate?: string | null;
  selectedShipmentMethod?: ShipmentMethod;
  idShipmentMethod?: number;
  shippingAddress?: Address;
  carriers?: Carrier[];
  id?: string;
}

export interface ContactDetails {
  firstName?: string;
  lastName?: string;
  email: string;
  salutation?: string;
}

export interface CheckoutResponse {
  orderReference: string;
  redirectUrl?: string;
  isExternalRedirect?: string;
  orders?: OrderData[];
}

export const guestCheckoutStorageKey = 'isGuestCheckout.storageKey';
export const shipmentCheckoutStorageKey = 'shipmentCheckout.storageKey';
export const paymentCheckoutStorageKey = 'paymentCheckout.storageKey';
export const contactCheckoutStorageKey = 'contactCheckout.storageKey';
export const addressCheckoutStorageKey = 'addressCheckout.storageKey';

export const defaultSelectedShipmentMethod = {
  deliveryTime: null,
  carrierName: '',
  currencyIsoCode: '',
  name: '',
  price: 0,
  id: 0,
};
