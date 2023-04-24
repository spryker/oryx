import { StaticComponent } from '@spryker-oryx/experience';

export const CategoryPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Category Page',
    route: '/category/:id',
    follow: true,
    index: true,
    description: 'Category Page Description',
  },
  components: [
    {
      type: 'experience-composition',
      components: [
        {
          type: 'search-facet-navigation',
          options: {
            data: {
              rules: [
                {
                  height: 'calc(100vh - 78px)',
                  sticky: true,
                  top: '78px',
                  span: '3',
                  margin: '30px 0',
                },
              ],
            },
          },
        },
        {
          type: 'experience-composition',
          components: [
            {
              type: 'experience-composition',
              components: [
                {
                  type: 'search-product-sort',
                  options: { data: { rules: [{ margin: '0 0 0 auto' }] } },
                },
              ],
              options: {
                data: { rules: [{ layout: 'flex', maxWidth: true }] },
              },
            },
            {
              id: 'category-list',
              type: 'oryx-product-list',
              options: {
                data: {
                  rules: [
                    {
                      layout: 'grid',
                      columnCount: '3',
                      span: '3',
                      gap: '30',
                      maxWidth: false,
                    },
                  ],
                },
              },
            },
            {
              type: 'experience-composition',
              components: [{ type: 'oryx-search-pagination' }],
              options: { data: { rules: [{ margin: '0 auto' }] } },
            },
          ],
          options: {
            data: {
              rules: [
                {
                  maxWidth: true,
                  layout: 'flex',
                  padding: '30px 0',
                  gap: '20',
                },
              ],
            },
          },
        },
      ],
      options: {
        data: { rules: [{ container: true, layout: 'column', gap: '30' }] },
      },
    },
  ],
};
