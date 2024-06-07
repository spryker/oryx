import {
  Product,
  ProductList,
  ProductListQualifier,
} from '@spryker-oryx/product';
import { MockProductService } from '../mock-product.service';

const createProducts = (qualifier: ProductListQualifier): Product[] => {
  const listLength = qualifier?.ipp || 12;

  if (listLength > MockProductService.mockProducts.length) {
    return MockProductService.mockProducts;
  }

  return [...MockProductService.mockProducts].splice(0, listLength);
};

export const createProductListMock = (
  productListQualifier: ProductListQualifier
): ProductList => {
  return {
    products: createProducts(productListQualifier),
  };
};
