import { StaticComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const contactPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Contact Page',
    route: '/contact',
    description: 'Contact Page Description',
  },
  options: {
    data: {
      rules: [
        {
          layout: 'list',
          margin: '50 0',
          padding: '10 0',
          bleed: true,
          background: 'var(--oryx-color-primary-3)',
        },
      ],
    },
  },
  components: [
    {
      type: 'oryx-content-link',
      options: {
        data: {
          type: 'rawUrl',
          id: '/contact',
          text: 'This is Contact Page element. Remove me when the page is implemented',
          icon: IconTypes.Check,
        },
      },
    },
  ],
};
