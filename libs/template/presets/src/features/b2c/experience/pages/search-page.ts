import { StaticComponent } from '@spryker-oryx/experience';

export const SearchPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Search',
    route: '/search',
    description: 'Default Search Page Description',
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
                  height: 'calc(100vh - 68px)',
                  sticky: true,
                  top: '68px',
                  scroll: true,
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
                  options: {
                    data: {
                      rules: [{ margin: '0 0 0 auto', align: 'end' }],
                    },
                  },
                },
              ],
              options: {
                data: {
                  rules: [{ layout: 'flex', span: '3', maxWidth: true }],
                },
              },
            },
            {
              type: 'oryx-product-list',
              options: {
                data: { rules: [{ layout: 'grid', span: '3', gap: '30' }] },
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
                  layout: 'flex',
                  maxWidth: true,
                  margin: '30px 0',
                  gap: '20px',
                },
              ],
            },
          },
        },
      ],
      options: {
        data: {
          rules: [
            { container: true, layout: 'column' },
            { breakpoint: 'md', layout: 'column', gap: '30px' },
          ],
        },
      },
    },
  ],
};
