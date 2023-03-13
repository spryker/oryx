import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { CurrencyService } from '@spryker-oryx/site';
import { Observable, switchMap, take } from 'rxjs';
import { ApiProductModel, Product, ProductQualifier } from '../../models';
import { ProductNormalizer } from './normalizers';
import { ProductAdapter } from './product.adapter';

export class DefaultProductAdapter implements ProductAdapter {
  protected productEndpoint = 'concrete-products';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected currencyService = inject(CurrencyService)
  ) {}

  getKey(qualifier: ProductQualifier): string {
    return (qualifier.sku ?? '') + qualifier.include?.sort()?.join('');
  }

  get({ sku, include }: ProductQualifier): Observable<Product> {
    include = [
      ApiProductModel.Includes.ConcreteProductImageSets,
      ApiProductModel.Includes.ConcreteProductPrices,
      ApiProductModel.Includes.ConcreteProductAvailabilities,
      ApiProductModel.Includes.Labels,
      ...(include ?? []),
    ].filter((type, index, arr) => arr.indexOf(type) === index);

    return this.currencyService.get().pipe(
      take(1),
      switchMap((currency) =>
        this.http.get<ApiProductModel.Response>(
          `${this.SCOS_BASE_URL}/${
            this.productEndpoint
          }/${sku}?currency=${currency}${include ? '&include=' : ''}${
            include?.join(',') || ''
          }`
        )
      ),
      this.transformer.do(ProductNormalizer)
    );
  }
}
