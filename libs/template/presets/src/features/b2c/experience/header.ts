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
          type: 'oryx-site-currency-selector',
          options: {
            data: { rules: [{ style: 'margin-inline-start: auto' }] },
          },
        },
        { type: 'oryx-site-locale-selector' },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'flex',
              background: 'var(--oryx-color-primary-500)',
              container: true,
              maxWidth: true,
              padding: '10px 0',
              gap: '10px',
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
        {
          type: 'oryx-site-navigation-item',
          options: {
            data: {
              contentBehavior: 'dropdown',
              label: 'USER.NAME',
              icon: 'user',
              rules: [{ width: '87px', maxWidth: true }],
            },
          },
          components: [{ type: 'oryx-auth-login-link' }],
        },
        {
          type: 'oryx-site-navigation-item',
          options: {
            data: {
              label: 'cart',
              badge: 'CART.SUMMARY',
              icon: 'cart',
              url: {
                type: 'cart',
              },
              rules: [{ maxWidth: false }],
            },
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
