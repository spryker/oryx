import { StaticComponent } from '@spryker-oryx/experience';

export const SearchPage: StaticComponent = {
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
      type: 'search-facet-navigation',
      options: {
        data: {
          rules: [{ sticky: true, top: '108' }],
        },
      },
    },
    {
      type: 'experience-composition',
      options: {
        data: { rules: [{ layout: 'flex', vertical: true, gap: '20px' }] },
      },
      components: [
        {
          type: 'experience-composition',
          components: [{ type: 'search-product-sort' }],
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
