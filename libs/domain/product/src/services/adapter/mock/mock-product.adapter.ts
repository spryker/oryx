import {ProductAdapter} from "../../index";
import {Product, ProductQualifier} from "@spryker-oryx/product";
import {Observable, of} from "rxjs";

export class MockProductAdapter implements ProductAdapter {
  getKey(qualifier: ProductQualifier): string {
    return (qualifier.sku ?? '') + qualifier.include?.sort()?.join('');
  }

  get({sku, include}: ProductQualifier): Observable<Product> {
    return of({
      sku: 'sku',
      name: 'name',
      price: 100,
      currency: 'USD',
      images: [],
      categories: [],
      attributes: [],
      labels: [],
      abstractProducts: [],
      availabilities: [],
      prices: [],
    });
  }
}
