export interface CheckoutData {
  addresses?: unknown[];
  paymentProviders?: unknown[];
  selectedShipmentMethods?: unknown[];
  shipments?: Shipment[];
  carriers?: Carrier[];
  shipment?: {
    idShipmentMethod: number;
  };
}

export interface Carrier {
  name?: string;
  shipmentMethods: ShipmentMethod[];
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
  items: string[];
  requestedDeliveryDate: string | null;
  selectedShipmentMethod?: ShipmentMethod;
  idShipmentMethod?: number;
  shippingAddress: Address;
  carriers?: Carrier[];
  id?: string;
}

export interface ContactDetails {
  firstName?: string;
  lastName?: string;
  email: string;
}

export const guestCheckoutStorageKey = 'isGuestCheckout.storageKey';

export const defaultSelectedShipmentMethod = {
  deliveryTime: null,
  carrierName: '',
  currencyIsoCode: '',
  name: '',
  price: 0,
  id: 0,
};
