import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ObserveController } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import {
  identity,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { Product, ProductComponentProperties } from '../models';
import { ProductContext, ProductService } from '../services';

/**
 * Controls product components by providing easy access to the
 * product data based on the context where the component is used.
 */
export class ProductController {
  protected context: ContextController;
  protected observe: ObserveController<LitElement & ProductComponentProperties>;
  protected productService = resolve(ProductService, null);

  constructor(protected host: LitElement & ProductComponentProperties) {
    // TODO: fix property assigning outside of constructor, it doesn't work in the storybook now
    this.observe = new ObserveController(host);
    this.context = new ContextController(host);
  }

  getProduct(): Observable<Product | undefined> {
    return this.context.get(ProductContext.SKU, this.observe.get('sku')).pipe(
      switchMap((sku, index) => {
        if (!sku) {
          return of(undefined);
        }
        return (
          this.productService
            ?.get({ sku })
            .pipe(index ? startWith(undefined) : identity) ?? of(undefined)
        );
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }
}
