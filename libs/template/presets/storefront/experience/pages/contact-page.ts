import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size, featureVersion } from '@spryker-oryx/utilities';

export const contactPage: ExperienceComponent = {
  id: 'contact-page',
  type: 'Page',
  meta: {
    title: 'Contact Page',
    route: '/contact',
    description: 'Contact Page Description',
  },
  options: {
    rules: [
      {
        layout: 'list',
        padding: '30px 0',
      },
    ],
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
          type: 'oryx-site-breadcrumb',
          options: {
            rules: [{ query: { breakpoint: Size.Sm }, hide: true }],
          },
        },
        {
          type: 'oryx-content-link',
          content: {
            data: {
              text: 'This is Contact Page element. Remove me when the page is implemented',
            },
          },
          options: {
            type: 'rawUrl',
            url: '/contact',
            icon: IconTypes.Check,
            rules: [
              {
                layout: 'list',
                padding: '10px',
                background: 'var(--oryx-color-primary-3)',
              },
            ],
          },
        },
      ],
      options: {
        rules: [
          {
            layout: 'list',
            padding: '30px 0',
          },
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
