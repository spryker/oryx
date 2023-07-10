import { StaticComponent } from '@spryker-oryx/experience';

export const searchPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Search',
    route: '/search',
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
        data: { rules: [{ layout: 'flex', vertical: true, gap: '20px' }] },
      },
      components: [
        {
          type: 'oryx-composition',
          name: 'Product list header',
          components: [{ type: 'oryx-search-product-sort' }],
          options: { data: { rules: [{ layout: 'flex', justify: 'end' }] } },
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
