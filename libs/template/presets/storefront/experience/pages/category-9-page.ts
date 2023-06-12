import { StaticComponent } from '@spryker-oryx/experience';

export const categoryNinePage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Category NINE Page',
    route: '/category/9',
    follow: true,
    index: true,
    description: 'Category Page Description',
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
      type: 'experience-composition',
      options: {
        data: { rules: [{ layout: 'list', gap: '20px' }] },
      },
      components: [
        {
          type: 'experience-composition',
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
