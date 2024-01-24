import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  CategoryNodeNormalizer,
  CategoryTreeNormalizer,
  ProductCategory,
  ProductCategoryAdapter,
  ProductCategoryQualifier,
} from '@spryker-oryx/product';
import { Observable } from 'rxjs';
import { ApiProductCategoryModel } from '../models';

export class DefaultProductCategoryAdapter implements ProductCategoryAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  get(
    qualifier: ProductCategoryQualifier | string
  ): Observable<ProductCategory> {
    if (typeof qualifier === 'string') return this.get({ id: qualifier });

    const fields = [
      ApiProductCategoryModel.Fields.MetaDescription,
      ApiProductCategoryModel.Fields.NodeId,
      ApiProductCategoryModel.Fields.Order,
      ApiProductCategoryModel.Fields.Name,
      ApiProductCategoryModel.Fields.Parents,
    ];

    return this.http
      .get<ApiProductCategoryModel.Response>(
        `${this.SCOS_BASE_URL}/category-nodes/${
          qualifier.id
        }?fields[category-nodes]=${fields.join(',')}`
      )
      .pipe(this.transformer.do(CategoryNodeNormalizer));
  }

  getTree(qualifier?: ProductCategoryQualifier): Observable<ProductCategory[]> {
    return this.http
      .get<ApiProductCategoryModel.TreeResponse>(
        `${this.SCOS_BASE_URL}/category-trees`
      )
      .pipe(this.transformer.do(CategoryTreeNormalizer));
  }
}
