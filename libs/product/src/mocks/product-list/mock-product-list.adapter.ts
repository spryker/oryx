import { ProductList, ProductListAdapter } from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { ProductListQualifier } from '../../models/product-list-qualifier';
import { createProductListMock } from './mock-product-list.generator';

export class MockProductListAdapter implements ProductListAdapter {
  protected readonly alias: Record<string, string> = {
    minPrice: 'price[min]',
    maxPrice: 'price[max]',
    storageCapacity: 'storage_capacity[]',
  };

  getKey(qualifier: ProductListQualifier): string {
    const qualifierKeys = Object.keys(qualifier);

    return qualifierKeys.length
      ? qualifierKeys
          .reduce((params: string[], key) => {
            const qualifierKey = key as keyof ProductListQualifier;
            const param = qualifier[qualifierKey];

            if (param) {
              params.push(
                `${this.alias[qualifierKey] ?? qualifierKey}=${param}`
              );
            }

            return params;
          }, [])
          .join('&')
      : '';
  }

  get(qualifier: ProductListQualifier): Observable<ProductList> {
    return of(createProductListMock(qualifier));
  }
}
