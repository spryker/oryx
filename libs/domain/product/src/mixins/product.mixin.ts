import { Type } from '@spryker-oryx/di';
import {
  ComponentMixin,
  ContentComponentProperties,
} from '@spryker-oryx/experience';
import { asyncState, Signal, signal, valueType } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ProductController } from '../controllers';
import type { Product } from '../models';
import { ProductComponentProperties } from '../models';

export declare class ProductMixinInterface
  implements ProductComponentProperties
{
  sku?: string;
  product?: Product | null;
  $product: Signal<Product | null>;

  protected productController: ProductController;
}

export const ProductMixin = <
  T extends Type<LitElement & ProductComponentProperties>
>(
  superClass: T
): Type<ProductMixinInterface> & T => {
  class ProductMixinClass extends superClass {
    @property({ reflect: true }) sku?: string;

    protected productController = new ProductController(this);

    @asyncState()
    protected product = valueType(this.productController.getProduct());

    protected $product = signal(this.productController.getProduct(), null);
  }
  // Cast return type to your mixin's interface intersected with the superClass type
  return ProductMixinClass as unknown as Type<ProductMixinInterface> & T;
};

/** @deprecated Use ProductMixin instead */
export const ProductComponentMixin = <T>(): Type<
  LitElement & ContentComponentProperties<T> & ProductComponentProperties
> => {
  class ProductComponent
    extends ComponentMixin<T>()
    implements ProductComponentProperties
  {
    @property({ reflect: true }) sku?: string;
    @property({ type: Object, reflect: true }) product?: Product;
  }
  return ProductComponent as Type<
    LitElement & ContentComponentProperties<T> & ProductComponentProperties
  >;
};
