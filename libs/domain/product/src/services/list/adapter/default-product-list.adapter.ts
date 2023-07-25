import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import {
  ApiProductModel,
  ProductList,
  ProductListQualifier,
} from '../../../models';
import { ProductListNormalizer } from '../../adapter';
import { ProductListAdapter } from './product-list.adapter';

export class DefaultProductListAdapter implements ProductListAdapter {
  protected queryEndpoint = 'catalog-search';
  protected readonly alias: Record<string, string> = {
    minPrice: 'price[min]',
    maxPrice: 'price[max]',
    minRating: 'rating[min]',
    storageCapacity: 'storage_capacity[]',
  };

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  getKey(qualifier: ProductListQualifier): string {
    const qualifierKeys = Object.keys(qualifier);

    return qualifierKeys.length
      ? qualifierKeys
          .reduce((params: string[], key) => {
            const qualifierKey = key as keyof ProductListQualifier;
            const param = qualifier[qualifierKey];

            if (param) {
              const paramList = String(param).split(',');

              params.push(
                paramList.length > 1
                  ? paramList
                      .map(
                        (plv) =>
                          `${this.alias[qualifierKey] ?? qualifierKey}[]=${plv}`
                      )
                      .join('&')
                  : `${this.alias[qualifierKey] ?? qualifierKey}=${param}`
              );
            }

            return params;
          }, [])
          .join('&')
      : '';
  }

  get(qualifier: ProductListQualifier): Observable<ProductList> {
    const include = [
      ApiProductModel.Includes.AbstractProducts,
      ApiProductModel.Includes.CategoryNodes,
      ApiProductModel.Includes.ConcreteProducts,
      ApiProductModel.Includes.ConcreteProductImageSets,
      ApiProductModel.Includes.ConcreteProductPrices,
      ApiProductModel.Includes.ConcreteProductAvailabilities,
      ApiProductModel.Includes.Labels,
    ];

    return this.http
      .get<ApiProductModel.Response>(
        `${this.SCOS_BASE_URL}/${this.queryEndpoint}?${this.getKey(
          qualifier
        )}&include=${include?.join(',')}`
      )
      .pipe(this.transformer.do(ProductListNormalizer));
  }
}
