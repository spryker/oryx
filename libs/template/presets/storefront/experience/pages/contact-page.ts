import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { featureVersion } from '@spryker-oryx/utilities';

export const contactPage: ExperienceComponent = {
  id: 'contact-page',
  type: 'Page',
  meta: {
    title: 'Contact Page',
    route: '/contact',
    description: 'Contact Page Description',
  },
  components: [
    featureVersion >= '1.1'
      ? {
          ref: 'header',
        }
      : {},
    {
      type: 'oryx-composition',
      components: [
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
          },
        },
      ],
      options: {
        rules: [
          {
            layout: 'list',
            padding: '10px 0',
            bleed: true,
            background: 'var(--oryx-color-primary-3)',
          },
        ],
      },
    },
    featureVersion >= '1.1'
      ? {
          ref: 'footer',
        }
      : {},
  ],
};
