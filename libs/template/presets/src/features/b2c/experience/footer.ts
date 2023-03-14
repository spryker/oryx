import { StaticComponent } from '@spryker-oryx/experience';

export const FooterTemplate: StaticComponent = {
  id: 'footer',
  type: 'Page',
  meta: { title: 'Footer', route: '/_footer' },
  components: [
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
              container: true,
              maxWidth: true,
              sticky: true,
              top: '100%',
              background: 'var(--oryx-color-canvas-200)',
              padding: '30px 0',
              layout: 'flex',
              margin: '30px 0 0',
            },
          ],
        },
      },
    },
  ],
};
