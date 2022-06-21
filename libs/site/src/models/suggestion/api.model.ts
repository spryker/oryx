import { ProductImage } from '@spryker-oryx/product';

export module ApiModel {
  export interface AbstractProduct {
    price?: number;
    abstractName?: string;
    abstractSku?: string;
    url?: string;
    images?: ProductImage[];
  }
}
