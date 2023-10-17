import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size, featureVersion } from '@spryker-oryx/utilities';

export const categoryPage: ExperienceComponent = {
  id: 'category-page',
  type: 'Page',
  meta: {
    title: 'Category Page',
    route: '/category/:id',
    follow: true,
    index: true,
  },
  components: [
    featureVersion >= '1.2'
      ? {
          ref: 'header',
        }
      : {},
    {
      type: 'oryx-composition',
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
          id: 'category-product-listing',
          name: 'Product listing',
          options: {
            rules: [{ layout: 'list', gap: '20px' }],
          },
          components: [
            {
              type: 'oryx-composition',
              id: 'category-product-listing-header',
              name: 'Product list header',
              options: { rules: [{ layout: 'flex' }] },
              components: [
                {
                  type: 'oryx-search-product-sort',
                  options: { rules: [{ margin: '0 0 0 auto' }] },
                },
              ],
            },
            {
              type: 'oryx-product-list',
              options: { rules: [{ layout: 'grid', gap: '30px' }] },
            },
            {
              type: 'oryx-search-pagination',
              options: { rules: [{ margin: '0 auto 20px' }] },
            },
          ],
        },
      ],
      options: {
        rules: [
          {
            layout: 'split-aside',
            padding: '30px 0 0',
          },
          { query: { breakpoint: 'md' }, splitColumnFactor: 1 / 3 },
        ],
      },
    },
    featureVersion >= '1.2'
      ? {
          ref: 'footer',
        }
      : {},
  ],
};
