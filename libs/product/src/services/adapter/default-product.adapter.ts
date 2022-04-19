import { CoreServices } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';
import { Product, ProductQualifier } from '../../models';
import { ProductAdapter } from './product.adapter';

interface JSON_API_MODEL<T> {
  data: {
    attributes: T;
  };
}

export class DefaultProductAdapter implements ProductAdapter {
  protected productEndpoint = 'abstract-products';

  constructor(
    protected http = inject(CoreServices.Http),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL')
  ) {}

  normalize(product: JSON_API_MODEL<Product>): Product {
    return product.data.attributes;
  }

  getKey(qualifier: ProductQualifier): string {
    return qualifier.sku ?? '';
  }

  get({ sku }: ProductQualifier): Observable<Product> {
    return this.http
      .get<JSON_API_MODEL<Product>>(
        `${this.SCOS_BASE_URL}/${this.productEndpoint}/${sku}`
      )
      .pipe(map((res) => this.normalize(res)));
  }
}
