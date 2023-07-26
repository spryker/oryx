import { ExperienceComponent } from '@spryker-oryx/experience';

export const searchPage: ExperienceComponent = {
  id: 'search',
  type: 'Page',
  meta: {
    title: 'Search',
    route: '/search',
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      id: 'searchBody',
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
          id: 'productListing',
          name: 'Product listing',
          options: {
            rules: [{ layout: 'flex', vertical: true, gap: '20px' }],
          },
          components: [
            {
              type: 'oryx-composition',
              id: 'productListingHeader',
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
    },
    { ref: 'footer' },
  ],
};
