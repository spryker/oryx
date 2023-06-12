import { Type } from '@spryker-oryx/di';
import {
  Signal,
  signal,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { ProductController } from '../controllers';
import type { Product } from '../models';
import { ProductComponentProperties } from '../models';

export declare class ProductMixinInterface
  implements ProductComponentProperties
{
  sku?: string;
  protected $product: Signal<Product | null>;
  protected productController: ProductController;
}

export const ProductMixin = <
  T extends Type<LitElement & ProductComponentProperties>
>(
  superClass: T
): Type<ProductMixinInterface> & T => {
  @signalAware()
  class ProductMixinClass extends superClass {
    @signalProperty({ reflect: true }) sku?: string;

    protected productController = new ProductController(this);

    protected $product = signal(this.productController.getProduct(), {
      initialValue: null,
    });
  }
  return ProductMixinClass as unknown as Type<ProductMixinInterface> & T;
};
