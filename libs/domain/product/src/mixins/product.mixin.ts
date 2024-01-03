import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  computed,
  featureVersion,
  Signal,
  signalAware,
  signalProperty,
  Type,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map, of } from 'rxjs';
import { PRODUCT } from '../entity';
import type { Product, ProductQualifier } from '../models';
import { ProductComponentProperties } from '../models';
import { ProductContext, ProductService } from '../services';

export declare class ProductMixinInterface
  implements ProductComponentProperties
{
  sku?: string;
  protected $product: Signal<Product | null>;
  protected $productQualifier: Signal<ProductQualifier | undefined>;
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

    protected $productQualifier: Signal<ProductQualifier | undefined> =
      computed(() =>
        this.sku
          ? of({ sku: this.sku } as ProductQualifier)
          : this.contextController
              .get(featureVersion >= '1.4' ? PRODUCT : ProductContext.SKU)
              .pipe(
                // TODO: deprecated since 1.3, mapping won't be needed as context will always return qualifier in 1.3+
                map((sku) =>
                  featureVersion >= '1.3' ? sku : ({ sku } as ProductQualifier)
                )
              )
      );

    protected $product = computed(() => {
      const qualifier = this.$productQualifier();
      return qualifier ? this.productService?.get(qualifier) : of(null);
    });
  }
  return ProductMixinClass as unknown as Type<ProductMixinInterface> & T;
};
