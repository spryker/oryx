import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { LitElement, ReactiveController } from 'lit';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Product, ProductContext } from '../models';
import { ProductService } from '../services';
import { ProductComponentProperties } from './product-component.properties';

/**
 * Controls product components by providing easy access to the
 * product data based on the context where the component is used.
 */
export class ProductController implements ReactiveController {
  protected context: ContextController;
  protected productService = resolve(this, ProductService);
  protected sku$ = new BehaviorSubject<string | undefined>(undefined);

  /**
   * Exposes the product based on the context.
   */
  public product$: Observable<Product | null>;

  hostConnected(): void {
    this.sku$.next(this.host.sku);
  }

  hostUpdated(): void {
    this.sku$.next(this.host.sku);
  }

  constructor(
    protected host: LitElement & ProductComponentProperties,
    include: string[] = []
  ) {
    host.addController(this);

    this.context = new ContextController(host);

    this.product$ = this.context
      .get(ProductContext.Code, this.sku$)
      .pipe(switchMap((sku) => this.productService.get({ sku, include })));
  }
}
