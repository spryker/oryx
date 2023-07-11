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
          content: { data: { text: 'FREE DELIVERY & RETURNS' } },
          options: { data: { url: '/', icon: IconTypes.Check } },
        },
        {
          type: 'oryx-content-link',
          content: { data: { text: '100 DAY RETURN POLICY' } },
          options: { data: { url: '/', icon: IconTypes.Check } },
        },
        {
          type: 'oryx-content-link',
          content: { data: { text: 'CLICK & COLLECT' } },
          options: { data: { url: '/', icon: IconTypes.Check } },
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
              style: 'color: white',
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
          type: 'oryx-content-image',
          content: {
            data: {
              graphic: 'logo',
              link: '/',
              linkLabel: 'Composable Storefront based on Oryx',
            },
          },
          options: {
            data: {
              rules: [
                { colSpan: 3, height: '42px' },
                { query: { breakpoint: 'md' }, colSpan: 2 },
              ],
              link: '/',
              linkLabel: 'Spryker logo',
            },
          },
        },
        {
          type: 'oryx-search-box',
          options: {
            data: {
              rules: [
                { colSpan: 6, width: 'auto' },
                { query: { breakpoint: 'md' }, colSpan: 4 },
              ],
            },
          },
        },
        {
          type: 'oryx-composition',
          components: [
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
                { colSpan: 3, layout: 'flex', justify: 'end' },
                { query: { breakpoint: 'md' }, colSpan: 2 },
              ],
            },
          },
        },
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'column',
              background: 'var(--oryx-color-primary-9)',
              align: 'center',
              zIndex: '1',
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
