import { Component } from '@spryker-oryx/experience';

export const FooterTemplate: Component<unknown> = {
  id: 'footer',
  type: 'Page',
  meta: {
    title: 'Footer',
    route: '/_footer',
  },
  components: [
    {
      type: 'experience-composition',
      name: 'Footer',
      components: [
        {
          type: 'oryx-content-link',
          name: 'Link',
          options: {
            data: {
              text: 'layout',
              id: '/layout',
              icon: 'cart',
            },
          },
        },
        {
          type: 'oryx-content-link',
          name: 'Link',
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
              fullWidth: true,
              sticky: true,
              top: '100%',
              background: 'var(--oryx-color-canvas-200)',
              padding: '30px 0',
              maxWidth: true,
              layout: 'flex',
            },
          ],
        },
      },
    },
  ],
};
