import { StaticComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

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
              id: '/',
              text: 'Free delivery & returns',
              icon: IconTypes.Mark,
            },
          },
        },
        {
          type: 'oryx-content-link',
          options: {
            data: {
              id: '/',
              text: '100 day return policy',
              icon: IconTypes.Mark,
            },
          },
        },
        {
          type: 'oryx-content-link',
          options: {
            data: {
              id: '/',
              text: 'Click & Collect',
              icon: IconTypes.Mark,
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
              layout: 'flex',
              background: 'hsl(0, 0%, 9.0%)',
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
              icon: IconTypes.User,
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
              icon: IconTypes.Cart,
              url: { type: 'cart' },
            },
          },
        },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'flex',
              background: 'var(--oryx-color-primary-300)',
              align: 'center',
              zIndex: '2',
              padding: '5px 0',
              gap: '5px',
              sticky: true,
              bleed: true,
            },
          ],
        },
      },
    },
  ],
};
