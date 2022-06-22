import { Product } from '../models';

export interface ProductComponentProperties {
  /**
   * A Stock Keeping Unit (SKU) is used both as an entity (a product or service)
   * as well as the unique identifier for such product. In this context, the `sku`
   * is used as a string reference to the product/service.
   */
  sku?: string;

  /**
   * Allow to pass product data directly bypassing the service
   */
  product?: Product;
}
