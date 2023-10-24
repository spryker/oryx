export interface MerchantQualifier {
  id?: string;
}

export interface Merchant {
  id: string;
  name: string;
  description: string;
  url: string;
  deliveryTime: string;
  schedule: MerchantSchedule;
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
  opened?: MerchantScheduleSlot[];
  closed?: MerchantScheduleSlot[];
}

export interface MerchantScheduleSlot {
  day?: string;
  date?: string;
  times?: TimeRange[];
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
