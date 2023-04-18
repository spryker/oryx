import { StaticComponent } from '@spryker-oryx/experience';

export const ProductPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Product Page', route: '/product/:sku' },
  options: {
    data: {
      rules: [
        {
          layout: 'split-column',
          splitColumnFactor: 0.66,
          padding: '30px 0 0',
        },
      ],
    },
  },
  components: [
    {
      type: 'experience-composition',
      options: { data: { rules: [{ layout: 'list' }] } },
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
      type: 'experience-composition',
      options: {
        data: {
          rules: [
            {
              layout: 'list',
              top: '108',
              sticky: true,
            },
          ],
        },
      },
      components: [
        {
          type: 'oryx-product-title',
          options: { data: { tag: 'h1' } },
        },
        { type: 'oryx-product-average-rating' },
        { type: 'oryx-product-id' },
        {
          type: 'oryx-product-price',
          options: { data: { enableSalesLabel: true } },
        },
        { type: 'oryx-cart-add' },
      ],
    },
    {
      type: 'oryx-product-list',
      options: {
        data: {
          category: '10',
          sort: 'rating',
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
