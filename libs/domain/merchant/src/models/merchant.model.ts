export interface MerchantQualifier {
  id?: string;
  scope?: string;
}

export interface Merchant {
  id: string;
  name?: string;
  description?: string;
  url?: string;
  deliveryTime?: string;
  schedule?: MerchantSchedule;
  /** A url of the logo. */
  logo?: string;
  /** A url of the banner. */
  banner?: string;
  contact?: {
    email?: string;
    phone?: string;
    fax?: string;
    person?: {
      name?: string;
      salutation?: string;
      role?: string;
      phone?: string;
    };
  };
  legal?: MerchantLegal;
}

export interface MerchantLegal {
  cancellationPolicy?: string;
  terms?: string;
  dataPrivacy?: string;
  imprint?: string;
}

export interface MerchantSchedule {
  weekdays?: MerchantWeekdaySlot[];
  dates?: MerchantDateSlot[];
}

export interface MerchantSlot {
  times?: TimeRange[];
}

export interface MerchantWeekdaySlot extends MerchantSlot {
  /**
   * The day of the week (e.g. Monday, Tuesday, etc.)
   */
  day: string;
}

export interface MerchantDateSlot extends MerchantSlot {
  date: string;
  note?: string;
}

export interface TimeRange {
  from: string;
  to: string;
}

export interface MerchantComponentProperties {
  /**
   * Merchant is a reference to a merchant entity (ID)
   */
  merchant?: string;
}
