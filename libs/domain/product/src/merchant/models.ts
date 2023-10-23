export interface MerchantQualifier {
  id?: string;
}

export interface Merchant {
  id: string;
  name: string;
  url: string;
  deliveryTime: string;
}

export interface MerchantComponentProperties {
  /**
   * Merchant is a reference to a merchant entity (ID)
   */
  merchant?: string;
}
