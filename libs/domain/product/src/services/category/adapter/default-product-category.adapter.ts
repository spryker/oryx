import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import {
  ApiProductCategoryModel,
  ProductCategory,
  ProductCategoryQualifier,
} from '../../../models';
import { CategoryNodeNormalizer, CategoryTreeNormalizer } from './normalizers';
import { ProductCategoryAdapter } from './product-category.adapter';

export class DefaultProductCategoryAdapter implements ProductCategoryAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  get(qualifier: ProductCategoryQualifier): Observable<ProductCategory> {
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
    // TODO: use qualifier to filter excludes
    return this.http
      .get<ApiProductCategoryModel.TreeResponse>(
        `${this.SCOS_BASE_URL}/category-trees`
      )
      .pipe(this.transformer.do(CategoryTreeNormalizer));
  }
}
