import { Observable, of } from 'rxjs';
import { ProductQualifier } from '../models/product-qualifier';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

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
      description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.

      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      `,
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
      averageRating: undefined,
      reviewCount: 0,
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
    },
    {
      sku: '6',
      name: 'Sample product no. 6',
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
    },
  ];

  get(qualifier: ProductQualifier): Observable<Product> {
    const product = MockProductService.mockProducts.find(
      (p) => p.sku === qualifier.sku
    );
    return of(product ?? MockProductService.mockProducts[0]);
  }
}
