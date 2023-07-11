import { CamelCase } from '@spryker-oryx/core/utilities';
import { ApiProductModel } from '../../../models';
import { ApiProductListModel } from '../../../models/product-list.api.model';
import { DeserializedAvailability } from './availability';

export type DeserializedProductIncludes = {
  [P in ApiProductModel.Includes as `${CamelCase<P>}`]?: P extends ApiProductModel.Includes.ConcreteProductImageSets
    ? ApiProductModel.ImageSets[]
    : P extends ApiProductModel.Includes.ConcreteProductPrices
    ? ApiProductModel.Prices[]
    : P extends ApiProductModel.Includes.CategoryNodes
    ? ApiProductModel.CategoryNodes[]
    : P extends ApiProductModel.Includes.AbstractProducts
    ? (ApiProductModel.Abstract &
        Pick<
          DeserializedProductIncludes,
          CamelCase<ApiProductModel.Includes.CategoryNodes>
        >)[]
    : P extends ApiProductModel.Includes.ConcreteProductAvailabilities
    ? DeserializedAvailability[]
    : P extends ApiProductModel.Includes.ConcreteProducts
    ? (ApiProductModel.Concrete &
        Pick<
          DeserializedProductIncludes,
          CamelCase<ApiProductModel.Includes.AbstractProducts>
        >)[]
    : never;
};

export type DeserializedProductListIncludes = {
  [P in ApiProductListModel.Includes as `${CamelCase<P>}`]?: P extends ApiProductListModel.Includes.AbstractProducts
    ? ApiProductModel.Abstract[]
    : P extends ApiProductListModel.Includes.RangeFacets
    ? ApiProductListModel.RangeFacet[]
    : P extends ApiProductListModel.Includes.ValueFacets
    ? ApiProductListModel.ValueFacet[]
    : P extends ApiProductListModel.Includes.CategoryTreeFilter
    ? ApiProductListModel.TreeFacet[]
    : P extends ApiProductListModel.Includes.Pagination
    ? ApiProductListModel.Pagination
    : P extends ApiProductListModel.Includes.Sort
    ? ApiProductListModel.Sort
    : never;
};
