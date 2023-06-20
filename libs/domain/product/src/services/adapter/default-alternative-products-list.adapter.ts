import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { ApiProductModel, Product, ProductQualifier } from '../../models';
import { AlternativeProductsListAdapter } from './alternative-products-list.adapter';
import { AlternativeProductsListNormalizer } from './normalizers/alternative-products-list';

export class DefaultAlternativeProductsListAdapter
  implements AlternativeProductsListAdapter
{
  protected getQueryEndpoint(sku: string): string {
    return `concrete-products/${sku}/concrete-alternative-products`;
  }

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  get({ sku }: ProductQualifier): Observable<Product[]> {
    const include = [ApiProductModel.Includes.ConcreteProductPrices];

    return this.http
      .get<ApiProductModel.Response>(
        `${this.SCOS_BASE_URL}/${this.getQueryEndpoint(
          sku!
        )}?include=${include?.join(',')}`
      )
      .pipe(this.transformer.do(AlternativeProductsListNormalizer));
  }
}
