import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size, featureVersion } from '@spryker-oryx/utilities';

export const productPage: ExperienceComponent = {
  id: 'product-page',
  type: 'Page',
  meta: {
    title: 'Product Page',
    route: '/product/:sku',
    description: 'Default Product Page Description',
  },
  components: [
    {
      type: 'oryx-composition',
      id: 'product-body',
      options: {
        rules: [
          {
            layout: 'split-main',
            padding: '30px 0 0',
          },
        ],
      },
      components: [
        ...(featureVersion >= '1.1'
          ? [
              {
                type: 'oryx-site-breadcrumb',
                options: {
                  rules: [
                    {
                      colSpan: 2,
                    },
                    { query: { breakpoint: Size.Sm }, hide: true },
                  ],
                },
              },
            ]
          : []),
        {
          type: 'oryx-composition',
          id: 'product-preview',
          options: { rules: [{ layout: 'flex', vertical: true }] },
          components: [
            {
              type: 'oryx-product-labels',
              options: { excluded: 'sale %' },
            },
            { type: 'oryx-product-images' },
            { type: 'oryx-product-description' },
            { type: 'oryx-product-attributes' },
          ],
        },
        {
          type: 'oryx-composition',
          id: 'product-info',
          options: {
            rules: [{ vertical: true, top: '108px', sticky: true }],
          },
          components: [
            {
              type: 'oryx-product-title',
              options: { tag: 'h1' },
            },
            {
              type: 'oryx-product-brand',
              options: { rules: [{ width: '70px' }] },
            },
            { type: 'oryx-product-average-rating' },
            { type: 'oryx-product-id' },
            {
              type: 'oryx-product-price',
              options: { enableSalesLabel: true },
            },
            { type: 'oryx-cart-add' },
            { type: 'oryx-product-availability' },
          ],
        },
      ],
    },
    {
      type: 'oryx-product-relations',
      options: {
        heading: 'Alternative Products',
        rules: [
          {
            layout: 'carousel',
            padding: '20 0',
            colSpan: 2,
          },
        ],
      },
    },
    {
      type: 'oryx-product-list',
      options: {
        heading: 'Related Products',
        rules: [
          {
            layout: 'carousel',
            padding: '20 0',
            colSpan: 2,
          },
        ],
      },
    },
  ],
};
