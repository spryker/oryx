import { StaticComponent } from '@spryker-oryx/experience';

export const ProductPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Product Page', route: '/product/:sku' },
  components: [
    {
      type: 'experience-composition',
      options: { data: { rules: [{ container: true, layout: 'two-column' }] } },
      components: [
        {
          type: 'experience-composition',
          options: { data: { rules: [{ padding: '30px 0' }] } },
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
                  sticky: true,
                  top: '110px',
                  maxWidth: true,
                  layout: 'list',
                  gap: '10px',
                  padding: '30px 0',
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
      ],
    },
    {
      type: 'oryx-product-list',
      options: {
        data: {
          rules: [
            {
              layout: 'carousel',
              container: true,
              gap: '20',
              padding: '20 0 0',
            },
          ],
          category: '10',
          sort: 'rating',
        },
      },
    },
  ],
};
