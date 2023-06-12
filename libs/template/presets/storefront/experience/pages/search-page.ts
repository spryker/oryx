import { StaticComponent } from '@spryker-oryx/experience';

export const searchPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Search',
    route: '/search',
    description: 'Default Search Page Description',
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
              vertical: true,
              gap: '1px',
              divider: true,
              sticky: true,
              top: '108px',
            },
          ],
        },
      },
    },
    {
      type: 'oryx-composition',
      options: {
        data: { rules: [{ layout: 'flex', vertical: true, gap: '20px' }] },
      },
      components: [
        {
          type: 'oryx-composition',
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
