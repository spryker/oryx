import { StaticComponent } from '@spryker-oryx/experience';

export const categoryPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Category Page',
    route: '/category/:id',
    follow: true,
    index: true,
  },
  options: {
    data: {
      rules: [
        {
          layout: 'split-aside',
          padding: '30px 0 0',
        },
        { query: { breakpoint: 'md' }, splitColumnFactor: 1 / 3 },
      ],
    },
  },
  components: [
    {
      type: 'oryx-search-facet-navigation',
      options: {
        data: {
          rules: [
            {
              layout: 'grid',
              gap: '1px',
              divider: true,
              sticky: true,
              top: '108px',
              margin: '0 0 30px',
            },
          ],
        },
      },
    },
    {
      type: 'oryx-composition',
      name: 'Product listing',
      options: {
        data: { rules: [{ layout: 'list', gap: '20px' }] },
      },
      components: [
        {
          type: 'oryx-composition',
          name: 'Product list header',
          options: { data: { rules: [{ layout: 'flex' }] } },
          components: [
            {
              type: 'oryx-search-product-sort',
              options: { data: { rules: [{ margin: '0 0 0 auto' }] } },
            },
          ],
        },
        {
          type: 'oryx-product-list',
          options: {
            data: { rules: [{ layout: 'grid', gap: '30px' }] },
          },
        },
        {
          type: 'oryx-search-pagination',
          options: { data: { rules: [{ margin: '0 auto 20px' }] } },
        },
      ],
    },
  ],
};
