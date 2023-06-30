import { StaticComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const HeaderTemplate: StaticComponent = {
  id: 'header',
  type: 'Page',
  meta: { title: 'Header', route: '/_header' },
  components: [
    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-content-link',
          content: {
            data: {
              text: 'FREE DELIVERY & RETURNS',
            },
          },
          options: {
            data: {
              url: '/',
              icon: IconTypes.Check,
            },
          },
        },
        {
          type: 'oryx-content-link',
          content: {
            data: {
              text: '100 DAY RETURN POLICY',
            },
          },
          options: { data: { url: '/', icon: IconTypes.Check } },
        },
        {
          type: 'oryx-content-link',
          content: {
            data: {
              text: 'CLICK & COLLECT  ',
            },
          },
          options: {
            data: {
              url: '/',
              icon: IconTypes.Check,
              color: 'light',
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
              style: ';color: white',
            },
          ],
        },
      },
    },
    {
      type: 'oryx-composition',
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
          type: 'oryx-search-box',
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
          id: 'mini-cart',
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
              background: 'var(--oryx-color-primary-9)',
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
