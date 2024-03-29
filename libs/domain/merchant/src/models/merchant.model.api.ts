import { ApiProductModel } from '@spryker-oryx/product';
import { Price } from '@spryker-oryx/site';

export module ApiMerchantModel {
  import ProductAvailability = ApiProductModel.ProductAvailability;

  export interface Merchant {
    id: string;
    merchantName: string;
    description: string;
    merchantUrl: string;
    deliveryTime: string;
    legalInformation: MerchantLegal;
    merchantOpeningHours: Schedule[];
    logoUrl: string;
    bannerUrl: string;
    publicEmail: string;
    publicPhone: string;
  }

  export interface MerchantLegal {
    cancellationPolicy?: string;
    terms?: string;
    dataPrivacy?: string;
    imprint?: string;
  }

  export interface Schedule {
    weekdaySchedule: WeekDaySlot[];
    dateSchedule: DateSlot[];
  }

  interface ScheduleSlot {
    timeFrom?: string;
    timeTo?: string;
  }

  export interface WeekDaySlot extends ScheduleSlot {
    day: string;
  }

  export interface DateSlot extends ScheduleSlot {
    date: string;
    noteGlossaryKey?: string;
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

  export const enum Includes {
    ProductOffers = 'product-offers',
    ProductOfferPrices = 'product-offer-prices',
    ProductOfferAvailabilities = 'product-offer-availabilities',
    Merchants = 'merchants',
  }
}
