import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  computed,
  featureVersion,
  Signal,
  signal,
  signalAware,
  signalProperty,
  Type,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map, of } from 'rxjs';
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

    protected $productQualifier: Signal<ProductQualifier | undefined> = signal(
      this.contextController
        .get<ProductQualifier>(ProductContext.SKU)
        .pipe(
          map((sku) =>
            featureVersion >= '1.3' ? sku : ({ sku } as ProductQualifier)
          )
        )
    );

    protected $product = computed(() => {
      const qualifier = this.sku ? { sku: this.sku } : this.$productQualifier();
      return qualifier ? this.productService?.get(qualifier) : of(null);
    });
  }
  return ProductMixinClass as unknown as Type<ProductMixinInterface> & T;
};
