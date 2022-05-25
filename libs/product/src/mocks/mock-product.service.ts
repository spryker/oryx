import { Observable, of, throwError } from 'rxjs';
import { Product } from '../models/product';
import { ProductQualifier } from '../models/product-qualifier';
import { ProductService } from '../services/product.service';

export class MockProductService implements Partial<ProductService> {
  mockProducts: Product[] = [
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
    },
  ];

  get(qualifier: ProductQualifier): Observable<Product> {
    const product = this.mockProducts.find((p) => p.sku === qualifier.sku);
    return product
      ? of(product)
      : throwError(() => new Error('Product not found'));
  }
}
