import { ProductAvailability, ProductPrices } from '@spryker-oryx/product';
import { Merchant } from './merchant.model';

export interface ProductOffer {
  id: string;
  isDefault?: boolean;
  price: ProductPrices;
  merchant: Merchant;
  availability?: ProductAvailability;
}
