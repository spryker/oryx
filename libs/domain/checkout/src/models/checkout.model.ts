import { OrderData } from '@spryker-oryx/order';
import { Observable } from 'rxjs';

export const enum CheckoutProcessState {
  Initializing = 'initializing',
  NotAvailable = 'n/a',
  Ready = 'ready',
  Busy = 'busy',
}

export interface CheckoutStep<T = unknown> {
  /**
   * TODO: instructions
   */
  collect(): Observable<T | null>;
}

export interface CheckoutData {
  addresses?: unknown[];
  paymentProviders?: unknown[];
  selectedShipmentMethods?: unknown[];
  selectedPaymentMethods?: unknown[];
  paymentMethods?: PaymentMethod[];
  shipments?: Shipment[];
  carriers?: Carrier[];
  shipment?: {
    idShipmentMethod: string;
  };
}

export interface Checkout {
  customer: ContactDetails;
  cartId: string;
  billingAddress: Address;
  shippingAddress?: Address;
  shipments?: Shipment[];
  shipment?: {
    idShipmentMethod: string;
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
  id: string;
  deliveryTime: number | null;
  carrierName: string;
  currencyIsoCode: string;
  name: string;
  price: number;
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
  idShipmentMethod?: string;
  shippingAddress?: Address;
  carriers?: Carrier[];
  id?: string;
}

export interface ContactDetails {
  firstName?: string;
  lastName?: string;
  email: string;
  salutation: string;
}

export interface CheckoutResponse {
  orderReference: string;
  redirectUrl?: string;
  isExternalRedirect?: boolean;
  orders?: OrderData[];
}

export const guestCheckoutStorageKey = 'isGuestCheckout.storageKey';
export const shipmentCheckoutStorageKey = 'oryx.checkout.shipment';
export const paymentCheckoutStorageKey = 'oryx.checkout.payment';
export const contactCheckoutStorageKey = 'contactCheckout.storageKey';
export const addressCheckoutStorageKey = 'addressCheckout.storageKey';

export const defaultSelectedShipmentMethod = {
  deliveryTime: null,
  carrierName: '',
  currencyIsoCode: '',
  name: '',
  price: 0,
  id: '0',
};
