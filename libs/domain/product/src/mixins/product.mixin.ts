import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  computed,
  Signal,
  signal,
  signalAware,
  signalProperty,
  Type,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import type { Product } from '../models';
import { ProductComponentProperties } from '../models';
import { ProductContext, ProductService } from '../services';

export declare class ProductMixinInterface
  implements ProductComponentProperties
{
  sku?: string;
  protected $product: Signal<Product | null>;
}

export const ProductMixin = <
  T extends Type<LitElement & ProductComponentProperties>
>(
  superClass: T
): Type<ProductMixinInterface> & T => {
  @signalAware()
  class ProductMixinClass extends superClass {
    @signalProperty({ reflect: true }) sku?: string;

    protected productService = resolve(ProductService, null);

    protected contextController = new ContextController(this);

    protected $productContext = signal(
      this.contextController.get<string>(ProductContext.SKU)
    );

    protected $product = computed(() => {
      const sku = this.sku ?? this.$productContext();
      return sku ? this.productService?.get({ sku }) : of(null);
    });
  }
  return ProductMixinClass as unknown as Type<ProductMixinInterface> & T;
};
