import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size, featureVersion } from '@spryker-oryx/utilities';

export const searchPage: ExperienceComponent = {
  id: 'search-page',
  type: 'Page',
  meta: {
    title: 'Search',
    route: '/search',
  },
  options: {
    rules: [
      {
        layout: 'split-aside',
        padding: '30px 0 0',
      },
      { query: { breakpoint: 'md' }, splitColumnFactor: 1 / 3 },
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
      type: 'oryx-search-facet-navigation',
      options: {
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
    {
      type: 'oryx-composition',
      id: 'product-listing',
      name: 'Product listing',
      options: {
        rules: [{ layout: 'flex', vertical: true, gap: '20px' }],
      },
      components: [
        {
          type: 'oryx-composition',
          id: 'product-listing-header',
          name: 'Product list header',
          components: [{ type: 'oryx-search-product-sort' }],
          options: { rules: [{ layout: 'flex', justify: 'end' }] },
        },
        {
          type: 'oryx-product-list',
          options: {
            rules: [{ layout: 'grid', gap: '30px' }],
          },
        },
        {
          type: 'oryx-search-pagination',
          options: { rules: [{ margin: '0 auto 20px' }] },
        },
      ],
    },
  ],
};
