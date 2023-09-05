import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { ApiProductCategoryModel, ProductCategoryNode } from '../../../models';
import { CategoryTreeNormalizer } from './normalizers';
import { ProductCategoryAdapter } from './product-category.adapter';

export class DefaultProductCategoryAdapter implements ProductCategoryAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  getTree(): Observable<ProductCategoryNode[]> {
    return this.http
      .get<ApiProductCategoryModel.Response>(
        `${this.SCOS_BASE_URL}/category-trees`
      )
      .pipe(this.transformer.do(CategoryTreeNormalizer));
  }
}
