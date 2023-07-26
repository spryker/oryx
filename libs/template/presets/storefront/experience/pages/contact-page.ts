import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const contactPage: ExperienceComponent = {
  id: 'contact',
  type: 'Page',
  meta: {
    title: 'Contact Page',
    route: '/contact',
    description: 'Contact Page Description',
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      id: 'contactBody',
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
    },
    { ref: 'footer' },
  ],
};
