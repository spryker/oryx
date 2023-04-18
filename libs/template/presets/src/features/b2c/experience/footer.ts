import { StaticComponent } from '@spryker-oryx/experience';

export const FooterTemplate: StaticComponent = {
  id: 'footer',
  type: 'Page',
  meta: { title: 'Footer', route: '/_footer' },
  components: [
    {
      type: 'oryx-site-notification-center',
    },
    {
      type: 'experience-composition',
      components: [
        {
          type: 'oryx-content-link',
          options: {
            data: {
              type: 'rawUrl',
              id: '/contact',
              text: 'Contact Us',
              icon: 'rocket',
            },
          },
        },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'free',
              align: 'center',
              top: '100%',
              background: 'var(--oryx-color-canvas-200)',
              padding: '30 0',
              bleed: true,
              sticky: true,
            },
          ],
        },
      },
    },
  ],
};
