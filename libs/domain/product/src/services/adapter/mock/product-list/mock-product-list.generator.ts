import {
  Product,
  ProductList,
  ProductListQualifier,
} from '@spryker-oryx/product';
import { mockProducts } from '../mock-product';

const createProducts = (qualifier: ProductListQualifier): Product[] => {
  const listLength = qualifier?.ipp || 12;

  if (listLength > mockProducts.length) {
    return mockProducts;
  }

  return [...mockProducts].splice(0, listLength);
};

export const createProductListMock = (
  productListQualifier: ProductListQualifier
): ProductList => {
  return {
    products: createProducts(productListQualifier),
  };
};
