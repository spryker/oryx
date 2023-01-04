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
import { Product, ProductComponentProperties, ProductContext } from '../models';
import { ProductService } from '../services';

/**
 * Controls product components by providing easy access to the
 * product data based on the context where the component is used.
 */
export class ProductController {
  protected context: ContextController;
  protected observe: ObserveController<LitElement & ProductComponentProperties>;
  protected productService = resolve(ProductService, null);

  constructor(
    protected host: LitElement & ProductComponentProperties,
    protected include: string[] = []
  ) {
    // TODO: fix property assigning outside of constructor, it doesn't work in the storybook now
    this.observe = new ObserveController(host);
    this.context = new ContextController(host);
  }

  getProduct(): Observable<Product | null> {
    return this.observe.get('product').pipe(
      switchMap((product) => {
        if (product) {
          return of(product);
        }

        return this.context
          .get(ProductContext.SKU, this.observe.get('sku'))
          .pipe(
            switchMap((sku, index) => {
              if (!sku) {
                return of(null);
              }

              return (
                this.productService
                  ?.get({ sku, include: this.include })
                  .pipe(index ? startWith(null) : identity) ?? of(null)
              );
            }),
            shareReplay({ refCount: true, bufferSize: 1 })
          );
      })
    );
  }
}
