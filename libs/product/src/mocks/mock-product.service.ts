import { Observable, of } from 'rxjs';
import { ProductQualifier } from '../models/product-qualifier';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

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

export class MockProductService implements Partial<ProductService> {
  static mockProducts: Product[] = [
    {
      sku: '1',
      name: 'Sample product',
      images,
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum..`,
      price: {
        defaultPrice: {
          currency: 'EUR',
          value: 1879,
          isNet: true,
        },
        originalPrice: {
          currency: 'EUR',
          value: 2879,
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
    },
    {
      sku: '2',
      name: 'Second sample product',
      images: [images[1]],
      description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.

      Lorem ipsum dolor sit amet, consectetur adipisicing elit

      Lorem ipsum dolor sit amet, consectetur adipisicing elit
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      `,
      price: {
        defaultPrice: {
          value: 1095,
          currency: 'EUR',
          isNet: false,
        },
      },
      averageRating: 2.5,
      reviewCount: 175,

      attributes: {
        brand: 'Brand2',
        color: 'color2',
      },
      attributeNames: {
        brand: 'Brand',
        color: 'Color',
      },
    },
    {
      sku: '3',
      name: 'Sample product no. 3',
      images: [...images, ...images, ...images, ...images, ...images],
      averageRating: undefined,
      reviewCount: 0,

      attributes: {
        brand: 'Brand3',
        color: 'color3',
      },
      attributeNames: {
        brand: 'Brand',
        color: 'Color',
      },
    },
    {
      sku: '4',
      name: 'Sample product no. 4',
      description: 'Lorem',
      price: {
        defaultPrice: {
          value: 1700,
          isNet: false,
          currency: 'EUR',
        },
        originalPrice: {
          value: 1900,
          isNet: false,
          currency: 'EUR',
        },
      },
      averageRating: 1,
      reviewCount: undefined,
      images,

      attributes: {
        brand: 'Brand4',
        color: 'color4',
      },
      attributeNames: {
        brand: 'Brand',
        color: 'Color',
      },
    },
    {
      sku: '5',
      name: 'Sample product no. 5',
      description: 'Lorem sample',
      price: {
        defaultPrice: {
          value: 1879,
          isNet: true,
          currency: 'EUR',
        },
        originalPrice: {
          value: 1779,
          isNet: true,
          currency: 'EUR',
        },
      },
      images,
      attributes: {
        brand: 'Brand5',
        color: 'color5',
      },
      attributeNames: {
        brand: 'Brand',
        color: 'Color',
      },
    },
    {
      sku: '6',
      name: 'Sample product no. 6 Sample product no. 6 Sample product no. 6 Sample product no. 6 Sample product no. 6 Sample product no. 6',
      description: 'Lorem ipsum dolor sit amet.',
      price: {
        defaultPrice: {
          value: 1879,
          isNet: true,
          currency: 'EUR',
        },
        originalPrice: {
          value: 1779,
          isNet: true,
          currency: 'EUR',
        },
      },
      images,
    },
    {
      sku: '7',
      name: 'Sample product no. 7',
      description:
        'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
      price: {
        defaultPrice: {
          value: 1879,
          isNet: true,
          currency: 'EUR',
        },
      },
      images: [],
      averageRating: 1,
      attributes: {
        brand: 'Brand6',
        color: 'color6',
      },
      attributeNames: {
        brand: 'Brand',
        color: 'Color',
      },
    },
  ];

  get(qualifier: ProductQualifier): Observable<Product> {
    const product = MockProductService.mockProducts.find(
      (p) => p.sku === qualifier.sku
    );
    return of(product ?? MockProductService.mockProducts[0]);
  }
}
