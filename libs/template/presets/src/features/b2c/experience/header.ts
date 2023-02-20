import { Component } from '@spryker-oryx/experience';

export const HeaderTemplate: Component<unknown> = {
  id: 'header',
  type: 'Page',
  meta: {
    title: 'Header',
    route: '/_header',
  },
  components: [
    {
      type: 'experience-composition',
      name: 'Composition',
      components: [
        {
          type: 'oryx-content-link',
          name: 'Link',
          options: {
            data: {
              type: 'rawUrl',
              id: '/',
              text: 'Home Page',
              icon: 'mark',
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
              text: 'Contact Page',
              icon: 'mark',
            },
          },
        },
        {
          type: 'site-notification-center',
          name: 'SiteNotification',
          options: {
            data: {},
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
              background: 'var(--oryx-color-primary-500)',
              gap: '40px',
              maxWidth: true,
              padding: '10px 0',
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
          name: 'logo',
          content: {
            data: {
              graphic: 'logo',
            },
          },
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
          name: 'Site search',
          options: {
            data: {
              rules: [
                {
                  width: '100%',
                  margin: '0 35px',
                  maxWidth: true,
                },
              ],
            },
          },
        },
        {
          type: 'oryx-user-summary',
        },
        {
          type: 'auth-logout',
          name: 'Auth Logout',
        },
        {
          type: 'cart-summary',
          options: {
            data: {
              maxVisibleQuantity: 99,
              rules: [
                {
                  maxWidth: false,
                },
              ],
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
