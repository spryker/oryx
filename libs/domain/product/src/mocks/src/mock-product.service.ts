import {
  Product,
  ProductLabel,
  ProductLabelAppearance,
  ProductMediaSet,
  ProductQualifier,
  ProductService,
} from '@spryker-oryx/product';

import { Observable, of } from 'rxjs';

const img1 = {
  sm: 'https://images.icecat.biz/img/gallery_mediums/29885545_9575.jpg',
  lg: 'https://images.icecat.biz/img/gallery/29885545_9575.jpg',
};
const img2 = {
  sm: 'https://images.icecat.biz/img/norm/medium/26138343-5454.jpg',
  lg: 'https://images.icecat.biz/img/norm/high/26138343-5454.jpg',
};

const img3 = {
  sm: 'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
  lg: 'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
};

const images = [
  {
    ...img1,
    xl: img1.lg,
    externalUrlLarge: img1.lg,
    externalUrlSmall: img1.sm,
  },
  {
    ...img2,
    xl: img2.lg,
    externalUrlLarge: img2.lg,
    externalUrlSmall: img2.sm,
  },
  {
    ...img3,
    xl: img3.lg,
    externalUrlLarge: img3.lg,
    externalUrlSmall: img3.sm,
  },
];

const mediaSet: ProductMediaSet[] = [
  {
    name: 'default',
    media: images,
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
      mediaSet,
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
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
      labels: [newLabel, saleLabel],
      availability: {
        quantity: 3,
        isNeverOutOfStock: false,
        availability: true,
      },
      categoryIds: ['category id 1'],
    },
    {
      sku: '2',
      name: 'Second sample product',
      mediaSet: [],
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
      labels: [newLabel],
      availability: {
        isNeverOutOfStock: true,
        quantity: 0,
        availability: false,
      },
      categoryIds: ['category id 2'],
    },
    {
      sku: '3',
      name: 'Sample product no. 3',
      mediaSet: [
        {
          name: 'default',
          media: [...images, ...images, ...images],
        },
      ],
      averageRating: undefined,

      attributes: {
        brand: 'Brand3',
        color: 'color3',
      },
      attributeNames: {
        brand: 'Brand',
        color: 'Color',
      },
      availability: {
        isNeverOutOfStock: false,
        quantity: 10,
        availability: true,
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
      mediaSet,

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
      mediaSet,
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
      description: 'Lorem ipsum dolor\nsit amet.',
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
      mediaSet,
    },
    {
      sku: '7',
      name: 'Sample product no. 7',
      description: 'Lorem ipsum dolor sit amet',
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
      mediaSet,
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
      mediaSet,
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
      sku: 'single-image',
      name: 'Sample product with one image',
      description: 'Lorem ipsum dolor sit amet.',
      mediaSet: [
        {
          name: 'default',
          media: [images[0]],
        },
      ],
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
      mediaSet: [],
    },

    {
      sku: 'mp-1',
      price: {
        defaultPrice: { value: 1879, isNet: true, currency: 'EUR' },
        originalPrice: { value: 1779, isNet: true, currency: 'EUR' },
      },
      offers: [
        {
          id: 'offer-1',
          merchant: {
            id: 'MER000005',
            name: 'Budget Cameras',
            deliveryTime: '1-3 days',
          },
          price: {
            defaultPrice: { value: 1579, isNet: true, currency: 'EUR' },
          },
        },
        {
          id: 'offer-2',
          merchant: {
            id: 'MER000005',
            name: 'Video King',
          },
          price: {
            defaultPrice: { value: 1879, isNet: true, currency: 'EUR' },
          },
          availability: {
            quantity: 5,
          },
        },
        {
          id: 'offer-3',
          merchant: {
            id: 'MER000005',
            name: 'Sony',
            deliveryTime: '2-4 days',
          },
          price: {
            defaultPrice: { value: 1279, isNet: true, currency: 'EUR' },
          },
          availability: {
            isNeverOutOfStock: true,
          },
        },
      ],
    },
    {
      sku: 'mp-2',
      price: {
        defaultPrice: { value: 1879, isNet: true, currency: 'EUR' },
      },
      availability: {
        isNeverOutOfStock: true,
        quantity: 0,
        availability: false,
      },
      offers: [
        {
          id: 'offer-2',
          merchant: {
            id: 'MER000005',
            name: 'Video King',
            deliveryTime: '2-4 days',
          },
          price: {
            defaultPrice: {
              value: 1879,
              isNet: true,
              currency: 'EUR',
            },
          },
        },
      ],
    },
  ];

  get(qualifier: ProductQualifier): Observable<Product> {
    const product = MockProductService.mockProducts.find(
      (p) => p.sku === qualifier.sku
    ) as Product;

    return of(productForOfferTransform(product, qualifier) as Product);
  }
}

// copied from merchant query to avoid cycle deps
function productForOfferTransform(
  data: Product,
  qualifier: ProductQualifier
): Product | void {
  if (data && data.offers?.length) {
    const selectedOffer = qualifier.offer
      ? data.offers?.find((o) => o.id === qualifier.offer)
      : data.offers?.find((o) => o.isDefault);
    return {
      ...data,
      merchantId: selectedOffer?.merchant?.id ?? undefined,
      price: selectedOffer?.price ?? data.price,
      availability: selectedOffer?.availability ?? data.availability,
    };
  }
}
