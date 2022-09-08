import { Product, ProductList } from '@spryker-oryx/product';
import { ProductListQualifier } from '../../models/product-list-qualifier';

const images = [
  {
    externalUrlSmall: 'https://images.icecat.biz/img/gallery/29885545_9575.jpg',
    externalUrlLarge:
      'https://images.icecat.biz/img/gallery_mediums/29885545_9575.jpg',
  },
  {
    externalUrlSmall:
      'https://images.icecat.biz/img/norm/medium/26138343-5454.jpg',
    externalUrlLarge:
      'https://images.icecat.biz/img/norm/high/26138343-5454.jpg',
  },
  {
    externalUrlSmall:
      'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
    externalUrlLarge: 'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
  },
];

const createProducts = (qualifier: ProductListQualifier): Product[] => {
  const products: Product[] = [];
  const listLength = qualifier?.ipp || 12;

  for (let i = 0; i < listLength; i++) {
    products.push({
      sku: String(i),
      name: `Some brand ${i}`,
      images,
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum..`,
      price: {
        defaultPrice: {
          currency: 'EUR',
          value: (i + 1) * 10,
          isNet: true,
        },
        originalPrice: {
          currency: 'EUR',
          value: (i + 2) * 10,
          isNet: true,
        },
      },
      averageRating: 2,
      reviewCount: 5,

      attributes: {
        brand: 'Brand1',
        color: 'color1',
      },
      attributeNames: {
        brand: 'Brand',
        color: 'Color',
      },
    });
  }

  return products;
};

export const createProductListMock = (
  productListQualifier: ProductListQualifier
): ProductList => {
  return {
    products: createProducts(productListQualifier),
  };
};
