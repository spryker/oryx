import { StaticComponent } from '@spryker-oryx/experience';

export const ContactPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Contact Page', route: '/contact' },
  options: {
    data: {
      rules: [
        {
          layout: 'list',
          margin: '50 0',
          padding: '10 0',
          bleed: true,
          background: 'var(--oryx-color-info-200)',
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
          icon: 'mark',
        },
      },
    },
  ],
};
