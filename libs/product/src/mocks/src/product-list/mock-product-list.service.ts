import {
  ProductList,
  ProductListQualifier,
  ProductListService,
} from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/utilities/typescript';
import { Observable, of } from 'rxjs';

export class MockProductListService implements Partial<ProductListService> {
  protected readonly productListSearchParams: Array<
    keyof ProductListQualifier
  > = [
    'q',
    'page',
    'maxPrice',
    'minPrice',
    'minRating',
    'ipp',
    'brand',
    'label',
    'weight',
    'color',
    'category',
    'sort',
  ];

  get(
    qualifier: ProductListQualifier
  ): Observable<NullableGeneric<ProductList>> {
    return of(null);
  }

  getSearchParams = (
    qualifier: ProductListQualifier
  ): Record<string, string> => {
    return this.productListSearchParams.reduce(
      (
        params: Record<string | number, string>,
        key: keyof ProductListQualifier
      ) => {
        if (qualifier[key]) {
          params[key] = qualifier[key] as string;
        }

        return params;
      },
      {}
    );
  };
}
