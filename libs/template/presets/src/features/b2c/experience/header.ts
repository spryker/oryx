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
            data: {
              rules: [{ style: 'margin-inline-start: auto' }],
            },
          },
        },
        { type: 'oryx-site-locale-selector' },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'free',
              background: 'var(--oryx-color-primary-500)',
              padding: '10px 0',
              gap: '10px',
              align: 'center',
              bleed: true,
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
              rules: [{ width: 'max-content', height: '42px' }],
              link: '/',
            },
          },
        },
        {
          type: 'search-box',
          options: {
            data: {
              rules: [{ margin: 'auto', width: '580px' }],
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
              url: { type: 'cart' },
            },
          },
        },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'free',
              background: 'var(--oryx-color-primary-300)',
              align: 'center',
              zIndex: '2',
              padding: '5px 0',
              gap: '5px',
              bleed: true,
              sticky: true,
            },
          ],
        },
      },
    },
  ],
};
