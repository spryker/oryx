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
import type { Product, ProductQualifier } from '../models';
import { ProductComponentProperties } from '../models';
import { ProductContext, ProductService } from '../services';

export declare class ProductMixinInterface
  implements ProductComponentProperties
{
  sku?: string;
  protected $product: Signal<Product | null>;
  protected $productQualifier: Signal<ProductQualifier | null>;
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

    protected $productQualifier: Signal<ProductQualifier | null> = computed(
      () => {
        const sku_context = (this.sku ?? this.$productContext() ?? '')?.split(
          ','
        );
        return sku_context
          ? {
              sku: sku_context[0],
              ...(sku_context[1] ? { offer: sku_context[1] } : {}),
            }
          : null;
      }
    );

    protected $product = computed(() => {
      const qualifier = this.$productQualifier();
      return qualifier ? this.productService?.get(qualifier) : of(null);
    });
  }
  return ProductMixinClass as unknown as Type<ProductMixinInterface> & T;
};
