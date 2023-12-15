import { ProductOffer } from '../models';

declare module '@spryker-oryx/product' {
  export interface Product {
    offers?: ProductOffer[];
    merchantId?: string;
  }
}
