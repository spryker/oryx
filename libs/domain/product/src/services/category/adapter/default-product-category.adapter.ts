import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { ApiProductCategoryModel, ProductCategory } from '../../../models';
import { CategoryNodeNormalizer, CategoryTreeNormalizer } from './normalizers';
import { ProductCategoryAdapter } from './product-category.adapter';

export class DefaultProductCategoryAdapter implements ProductCategoryAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  get(categoryId: string): Observable<ProductCategory> {
    const fields = [
      ApiProductCategoryModel.Fields.MetaDescription,
      ApiProductCategoryModel.Fields.NodeId,
      ApiProductCategoryModel.Fields.Order,
      ApiProductCategoryModel.Fields.Name,
      ApiProductCategoryModel.Fields.Parents,
    ];

    return this.http
      .get<ApiProductCategoryModel.Response>(
        `${
          this.SCOS_BASE_URL
        }/category-nodes/${categoryId}?fields[category-nodes]=${fields.join(
          ','
        )}`
      )
      .pipe(this.transformer.do(CategoryNodeNormalizer));
  }

  getTree(): Observable<ProductCategory[]> {
    return this.http
      .get<ApiProductCategoryModel.TreeResponse>(
        `${this.SCOS_BASE_URL}/category-trees`
      )
      .pipe(this.transformer.do(CategoryTreeNormalizer));
  }
}
