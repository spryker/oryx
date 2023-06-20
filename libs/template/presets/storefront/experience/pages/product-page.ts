import { StaticComponent } from '@spryker-oryx/experience';

export const productPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Product Page',
    route: '/product/:sku',
    description: 'Default Product Page Description',
  },

  components: [
    {
      type: 'oryx-composition',
      options: {
        data: {
          rules: [
            {
              layout: 'split-main',
              padding: '30px 0 0',
            },
          ],
        },
      },
      components: [
        {
          type: 'oryx-composition',
          options: { data: { rules: [{ layout: 'flex', vertical: true }] } },
          components: [
            {
              type: 'oryx-product-labels',
              options: { data: { excluded: 'sale %' } },
            },
            { type: 'oryx-product-images' },
            { type: 'oryx-product-description' },
            { type: 'oryx-product-attributes' },
          ],
        },
        {
          type: 'oryx-composition',
          options: {
            data: {
              rules: [{ vertical: true, top: '108px', sticky: true }],
            },
          },
          components: [
            {
              type: 'oryx-product-title',
              options: { data: { tag: 'h1' } },
            },
            {
              type: 'oryx-product-brand',
              options: { data: { rules: [{ width: '70px' }] } },
            },
            { type: 'oryx-product-average-rating' },
            { type: 'oryx-product-id' },
            {
              type: 'oryx-product-price',
              options: { data: { enableSalesLabel: true } },
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
        data: {
          rules: [
            {
              layout: 'carousel',
              padding: '20 0',
              colSpan: '2',
            },
          ],
        },
      },
    },
  ],
};
