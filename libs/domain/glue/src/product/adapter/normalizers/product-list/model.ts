import { CamelCase } from '@spryker-oryx/core/utilities';
import { ApiProductListModel } from '../../../models/product-list.api.model';
import { DeserializedProductListIncludes } from '../model';

export type DeserializedProductList = Pick<
  DeserializedProductListIncludes,
  | CamelCase<ApiProductListModel.Includes.AbstractProducts>
  | CamelCase<ApiProductListModel.Includes.RangeFacets>
  | CamelCase<ApiProductListModel.Includes.ValueFacets>
  | CamelCase<ApiProductListModel.Includes.CategoryTreeFilter>
  | CamelCase<ApiProductListModel.Includes.Pagination>
  | CamelCase<ApiProductListModel.Includes.Sort>
>;
