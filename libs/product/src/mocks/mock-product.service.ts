import { Observable, of, throwError } from 'rxjs';
import { ProductQualifier } from '../models/';
import { Product } from '../models/product';
import { ProductService } from '../services/';

export class MockProductService implements Partial<ProductService> {
  static mockProducts: Product[] = [
    {
      sku: '1',
      name: 'Sample product',
      images: [
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery/29885545_9575.jpg',
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
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
      ],
      prices: [
        {
          priceTypeName: 'DEFAULT',
          netAmount: null,
          grossAmount: 1879,
          currency: {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
          },
          volumePrices: [],
        },
        {
          priceTypeName: 'ORIGINAL',
          netAmount: null,
          grossAmount: 2000,
          currency: {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
          },
          volumePrices: [],
        },
      ],
      description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.

      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      `,
      averageRating: '2',
      reviewCount: 5,
    },
    {
      sku: '2',
      name: 'Second sample product',
      images: [
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery/29885545_9575.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery_mediums/29885545_9575.jpg',
        },
      ],
      prices: [
        {
          priceTypeName: 'DEFAULT',
          netAmount: null,
          grossAmount: 1879,
          currency: {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
          },
          volumePrices: [],
        },
      ],
      description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.

      Lorem ipsum dolor sit amet, consectetur adipisicing elit

      Lorem ipsum dolor sit amet, consectetur adipisicing elit
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      `,
      averageRating: '2.5',
      reviewCount: 175,
    },
    {
      sku: '3',
      name: 'Sample product no. 3',
      images: [
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery/29885545_9575.jpg',
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
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
        {
          externalUrlSmall:
            'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
          externalUrlLarge:
            'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
        },
      ],
      prices: [],
      averageRating: '0',
      reviewCount: 0,
    },
    {
      sku: '4',
      name: 'Sample product no. 4',
      prices: [
        {
          priceTypeName: 'DEFAULT',
          netAmount: 1879,
          grossAmount: 1879,
          currency: {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
          },
          volumePrices: [],
        },
        {
          priceTypeName: 'ORIGINAL',
          netAmount: 1879,
          grossAmount: 2000,
          currency: {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
          },
          volumePrices: [],
        },
      ],
      description: 'Lorem',
      reviewCount: undefined,
    },
    {
      sku: '5',
      name: 'Sample product no. 5',
      prices: [
        {
          priceTypeName: 'DEFAULT',
          netAmount: 1879,
          grossAmount: null,
          currency: {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
          },
          volumePrices: [],
        },
        {
          priceTypeName: 'ORIGINAL',
          netAmount: 1879,
          grossAmount: null,
          currency: {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
          },
          volumePrices: [],
        },
      ],
      description: 'Lorem sample',
    },
    {
      sku: '6',
      name: 'Sample product no. 6',
      prices: [
        {
          priceTypeName: 'DEFAULT',
          netAmount: 1879,
          grossAmount: 1879,
          currency: {
            code: 'WRONG',
            name: 'Euro',
            symbol: '€',
          },
          volumePrices: [],
        },
        {
          priceTypeName: 'ORIGINAL',
          netAmount: 1879,
          grossAmount: 2000,
          currency: {
            code: 'WRONG',
            name: 'Euro',
            symbol: '€',
          },
          volumePrices: [],
        },
      ],
      description: 'Lorem ipsum dolor sit amet.',
    },
  ];

  get(qualifier: ProductQualifier): Observable<Product> {
    const product = MockProductService.mockProducts.find(
      (p) => p.sku === qualifier.sku
    );
    return product
      ? of(product)
      : throwError(() => new Error('Product not found'));
  }
}
