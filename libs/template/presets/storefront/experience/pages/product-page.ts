import { ExperienceComponent } from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { featureVersion } from '@spryker-oryx/utilities';

export const productPage: ExperienceComponent = {
  id: 'product-page',
  type: 'Page',
  meta: {
    title: 'Product Page',
    route: '/product/:sku',
    description: 'Default Product Page Description',
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
        {
          type: 'oryx-composition',
          id: 'product-body',
          options: {
            rules: [
              {
                layout:
                  featureVersion >= '1.2'
                    ? { type: 'split', columnWidthType: 'main' }
                    : 'split-main',
                padding: '30px 0 0',
              },
            ],
          },
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
              type: 'oryx-composition',
              id: 'product-preview',
              options: {
                rules: [
                  {
                    ...(featureVersion >= '1.2'
                      ? { layout: { type: 'flex', vertical: true } }
                      : { layout: 'flex', vertical: true }),
                  },
                ],
              },
              components: [
                {
                  type: 'oryx-product-labels',
                  options: { excluded: 'sale %' },
                },
                { type: 'oryx-product-images' },
                { type: 'oryx-product-description' },
                { type: 'oryx-product-attributes' },
              ],
            },
            {
              type: 'oryx-composition',
              id: 'product-info',
              options: {
                rules: [
                  {
                    layout: {
                      vertical: true,
                      sticky: true,
                    },
                    top: '108px',
                    ...(featureVersion >= '1.2'
                      ? {}
                      : { sticky: true, vertical: true }),
                  },
                ],
              },
              components: [
                {
                  type: 'oryx-product-title',
                  options: {
                    tag: 'h1',
                    ...(featureVersion >= '1.4'
                      ? {
                          tag: HeadingTag.H1,
                          typography: HeadingTag.H3,
                          maxLines: 2,
                        }
                      : {}),
                  },
                },
                {
                  type: 'oryx-product-brand',
                  options: { rules: [{ width: '70px' }] },
                },
                { type: 'oryx-product-average-rating' },
                { type: 'oryx-product-id' },
                {
                  type: 'oryx-product-price',
                  options: { enableSalesLabel: true },
                },
                { type: 'oryx-cart-add' },
                { type: 'oryx-product-availability' },
              ],
            },
          ],
        },
        {
          type: 'oryx-product-relations',
          options: {
            heading: 'Alternative Products',
            rules: [
              {
                layout:
                  featureVersion >= '1.2' ? { type: 'carousel' } : 'carousel',
                padding: '20 0',
                colSpan: 2,
              },
            ],
          },
        },
        {
          type: 'oryx-product-list',
          options: {
            heading: 'Related Products',
            rules: [
              {
                layout: 'carousel',
                padding: '20 0',
                colSpan: 2,
              },
            ],
          },
        },
      ],
    },
    featureVersion >= '1.2'
      ? {
          ref: 'footer',
        }
      : {},
  ],
};
