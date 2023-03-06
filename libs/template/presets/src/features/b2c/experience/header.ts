import { StaticComponent } from '@spryker-oryx/experience';

export const HeaderTemplate: StaticComponent = {
  id: 'header',
  type: 'Page',
  meta: { title: 'Header', route: '/_header' },
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
              icon: 'mark',
            },
          },
        },
        {
          type: 'oryx-mode-selector',
          options: {
            data: {
              rules: [
                {
                  margin: '0 0 0 auto',
                },
              ],
            },
          },
        },
        { type: 'site-notification-center' },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'flex',
              container: true,
              fullWidth: true,
              background: 'var(--oryx-color-primary-500)',
              maxWidth: true,
              padding: '10px 0',
              align: 'center',
            },
          ],
        },
      },
    },
    {
      type: 'experience-composition',
      name: 'Composition',
      components: [
        {
          type: 'oryx-content-banner',
          content: { data: { graphic: 'logo' } },
          options: {
            data: {
              rules: [
                {
                  width: 'max-content',
                  height: '42px',
                },
              ],
              link: '/',
            },
          },
        },
        {
          type: 'search-box',
          options: {
            data: {
              rules: [{ width: '100%', margin: '0 35px', maxWidth: true }],
            },
          },
        },
        { type: 'oryx-user-summary' },
        {
          type: 'oryx-cart-summary',
          options: {
            data: { maxVisibleQuantity: 99, rules: [{ maxWidth: false }] },
          },
        },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'flex',
              container: true,
              fullWidth: true,
              background: 'var(--oryx-color-primary-300)',
              align: 'center',
              sticky: true,
              zIndex: '2',
              maxWidth: true,
              padding: '5px 0',
            },
          ],
        },
      },
    },
  ],
};
