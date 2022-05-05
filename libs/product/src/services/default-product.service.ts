/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject } from '@spryker-oryx/injector';
import { Observable, ReplaySubject } from 'rxjs';
import { Product, ProductQualifier } from '../models';
import { ProductAdapter } from './adapter';
import { ProductService } from './product.service';

export class DefaultProductService implements ProductService {
  protected products = new Map<string, ReplaySubject<Product>>();

  constructor(protected adapter = inject(ProductAdapter)) {}

  get(qualifier: ProductQualifier): Observable<Product> {
    const key = this.adapter.getKey(qualifier);
    if (!this.products.has(key)) {
      this.products.set(key, new ReplaySubject<Product>(1));
      this.reload(qualifier, key);
    }
    return this.products.get(key)!;
  }

  protected reload(qualifier: ProductQualifier, key?: string): void {
    if (key === undefined) {
      key = this.adapter.getKey(qualifier);
    }
    this.adapter.get(qualifier).subscribe((product) => {
      this.products.get(key!)!.next(product);
    });
  }
}
