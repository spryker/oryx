import { StaticComponent } from '@spryker-oryx/experience';

export const CategoryPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Category Page', route: '/category/:id' },
  options: {
    data: {
      rules: [
        {
          layout: 'split-column',
          splitColumnFactor: 0.25,
          padding: '30 0',
        },
        { breakpoint: 'md', splitColumnFactor: 0.33 },
      ],
    },
  },
  components: [
    {
      type: 'search-facet-navigation',
      options: {
        data: {
          rules: [
            {
              height: 'calc(100vh - 68px)',
              sticky: true,
              top: '108',
            },
          ],
        },
      },
    },
    {
      type: 'experience-composition',
      options: {
        data: { rules: [{ layout: 'list', gap: '20px' }] },
      },
      components: [
        {
          type: 'experience-composition',
          options: { data: { rules: [{ layout: 'free' }] } },
          components: [
            {
              type: 'search-product-sort',
              options: { data: { rules: [{ margin: '0 0 0 auto' }] } },
            },
          ],
        },
        {
          type: 'oryx-product-list',
          options: {
            data: { rules: [{ layout: 'grid', gap: '30' }] },
          },
        },
        {
          type: 'experience-composition',
          options: { data: { rules: [{ margin: 'auto', padding: '10px' }] } },
          components: [{ type: 'oryx-search-pagination' }],
        },
      ],
    },
  ],
};
