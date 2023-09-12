import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable } from 'rxjs';
import { ApiProductModel, Product, ProductQualifier } from '../../models';
import { ProductNormalizer } from './normalizers';
import { ProductAdapter } from './product.adapter';

export class DefaultProductAdapter implements ProductAdapter {
  protected productEndpoint = 'concrete-products';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
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
      ApiProductModel.Includes.AbstractProducts,
      ApiProductModel.Includes.CategoryNodes,
      ...(include ?? []),
    ].filter((type, index, arr) => arr.indexOf(type) === index);

    const categoryNodeFields = [
      ApiProductModel.CategoryNodeFields.MetaDescription,
      ApiProductModel.CategoryNodeFields.NodeId,
      ApiProductModel.CategoryNodeFields.Order,
      ApiProductModel.CategoryNodeFields.Name,
      ApiProductModel.CategoryNodeFields.Parents,
      ApiProductModel.CategoryNodeFields.IsActive,
    ];

    const fields =
      featureVersion >= '1.1'
        ? `&fields[${
            ApiProductModel.Includes.CategoryNodes
          }]=${categoryNodeFields.join(',')}
    `
        : '';

    return this.http
      .get<ApiProductModel.Response>(
        `${this.SCOS_BASE_URL}/${this.productEndpoint}/${sku}${
          include ? '?include=' : ''
        }${include?.join(',') || ''}
        ${fields}`
      )
      .pipe(this.transformer.do(ProductNormalizer));
  }
}
