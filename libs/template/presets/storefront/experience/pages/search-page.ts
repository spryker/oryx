import { ExperienceComponent } from '@spryker-oryx/experience';
import { PRODUCTS } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { featureVersion } from '@spryker-oryx/utilities';

export const searchPage: ExperienceComponent = {
  id: 'search-page',
  type: 'Page',
  meta: {
    title: 'Search',
    route: '/search',
    routeType: featureVersion >= '1.4' ? PRODUCTS : RouteType.ProductList,
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
                  rules: [{ colSpan: 2 }],
                },
              },
            ]
          : []),
        {
          type: 'oryx-search-facet-navigation',
          options: {
            rules: [
              {
                layout:
                  featureVersion >= '1.2'
                    ? {
                        type: 'grid',
                        divider: true,
                        sticky: true,
                      }
                    : 'grid',
                gap: '1px',
                top: '108px',
                margin: '0 0 30px',
                ...(featureVersion >= '1.2'
                  ? {}
                  : { sticky: true, divider: true }),
              },
            ],
          },
        },
        {
          type: 'oryx-composition',
          id: 'product-listing',
          name: 'Product listing',
          options: {
            rules: [
              {
                layout:
                  featureVersion >= '1.4'
                    ? { type: 'list' }
                    : featureVersion >= '1.2'
                    ? {
                        type: 'flex',
                        vertical: true,
                      }
                    : 'flex',
                gap: '20px',
                ...(featureVersion >= '1.2' ? {} : { vertical: true }),
              },
            ],
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
      options: {
        rules: [
          {
            layout:
              featureVersion >= '1.2'
                ? { type: 'split', columnWidthType: 'aside' }
                : 'split-aside',
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
