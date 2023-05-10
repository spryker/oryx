import { StaticComponent } from '@spryker-oryx/experience';

export const ContactPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Contact Page',
    route: '/contact',
    description: 'Contact Page Description',
  },
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
              text: 'This is Contact Page element. Remove me when the page is implemented',
              icon: 'mark',
            },
          },
        },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'column',
              container: true,
              fullWidth: true,
              background: 'var(--oryx-color-info-200)',
              gap: '40px',
              maxWidth: true,
              padding: '10px 0',
              margin: '50px 0',
            },
          ],
        },
      },
    },
  ],
};
