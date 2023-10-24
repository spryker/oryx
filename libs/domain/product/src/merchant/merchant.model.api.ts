import { Price } from '@spryker-oryx/site';
import { ProductAvailability } from '../models';

export module ApiMerchantModel {
  export interface Merchant {
    id: string;
    merchantName: string;
    description: string;
    merchantUrl: string;
    deliveryTime: string;
    legalInformation: {
      cancellationPolicy?: string;
      terms?: string;
      dataPrivacy?: string;
      imprint?: string;
    };
    merchantOpeningHours: MerchantOpeningHours[];
    logoUrl: string;
    bannerUrl: string;
    publicEmail: string;
    publicPhone: string;
  }

  export interface MerchantOpeningHours {
    weekdaySchedule: WeekDaySchedule[];
  }

  export interface WeekDaySchedule {
    day?: string;
    timeFrom?: string;
    timeTo?: string;
  }

  export interface ProductOffer {
    id: string;
    isDefault?: boolean;
    merchantReference: string;
    price?: number;
    merchants: Merchant[];
    productOfferPrices: ProductOfferPrice[];
    productOfferAvailabilities: ProductAvailability[];
  }

  export interface ProductOfferPrice {
    id: string;
    price: number;
    prices: Price[];
  }
}
