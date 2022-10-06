import {
  Product,
  ProductLabel,
  ProductLabelAppearance,
  ProductQualifier,
  ProductService,
} from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';

const images = [
  {
    externalUrlSmall:
      'https://images.icecat.biz/img/gallery_mediums/29885545_9575.jpg',
    externalUrlLarge: 'https://images.icecat.biz/img/gallery/29885545_9575.jpg',
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

const newLabel: ProductLabel = {
  name: 'New',
  appearance: ProductLabelAppearance.Highlight,
};

const saleLabel: ProductLabel = {
  name: 'sale',
  appearance: ProductLabelAppearance.Info,
};

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
      labels: [newLabel],
    },
    {
      sku: '2',
      name: 'Second sample product',
      images: [],
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
      labels: [newLabel, saleLabel],
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
      description: 'Lorem ipsum dolor sit amet.',
      price: {
        defaultPrice: {
          value: 1900,
          isNet: true,
          currency: 'EUR',
        },
        originalPrice: {
          value: 1958,
          isNet: true,
          currency: 'EUR',
        },
      },
      images,
      attributes: {
        brand: 'Brand7',
        color: 'color7',
      },
      attributeNames: {
        brand: 'Brand',
        color: 'Color',
      },
    },
    {
      sku: '8',
      name: 'Sample product no. 8',
      description: 'Lorem ipsum dolor sit amet.',
      price: {
        defaultPrice: {
          value: 1900,
          isNet: true,
          currency: 'EUR',
        },
        originalPrice: {
          value: 1958,
          isNet: true,
          currency: 'EUR',
        },
      },
      images,
      attributes: {
        brand: 'Brand8',
        SampleAttribute:
          'Sample attribute lengthy value, Sample attribute lengthy value, Sample attribute lengthy value.',
      },
      attributeNames: {
        brand: 'Brand',
        SampleAttribute:
          'Sample attribute lengthy name, Sample attribute lengthy name, Sample attribute lengthy name.',
      },
    },
    {
      sku: 'without-images',
      name: 'Sample product without images',
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
    },
    {
      sku: 'without-small-image',
      name: 'Sample product without small image',
      description:
        'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
      price: {
        defaultPrice: {
          value: 1879,
          isNet: true,
          currency: 'EUR',
        },
      },
      images: [
        { externalUrlLarge: images[0].externalUrlLarge, externalUrlSmall: '' },
      ],
    },
    {
      sku: 'without-large-image',
      name: 'Sample product without large image',
      description:
        'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
      price: {
        defaultPrice: {
          value: 1879,
          isNet: true,
          currency: 'EUR',
        },
      },
      images: [
        { externalUrlSmall: images[0].externalUrlSmall, externalUrlLarge: '' },
      ],
    },
  ];

  get(qualifier: ProductQualifier): Observable<Product> {
    const product = MockProductService.mockProducts.find(
      (p) => p.sku === qualifier.sku
    ) as Product;

    return of(product);
  }
}
