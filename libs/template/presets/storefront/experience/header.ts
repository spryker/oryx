import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const HeaderTemplate: ExperienceComponent = {
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
          options: { url: '/', icon: IconTypes.Check },
        },
        {
          type: 'oryx-content-link',
          content: { data: { text: '100 DAY RETURN POLICY' } },
          options: { url: '/', icon: IconTypes.Check },
        },
        {
          type: 'oryx-content-link',
          content: { data: { text: 'CLICK & COLLECT' } },
          options: { url: '/', icon: IconTypes.Check },
        },
        {
          type: 'oryx-site-currency-selector',
          options: {
            rules: [{ style: 'margin-inline-start: auto' }],
          },
        },
        { type: 'oryx-site-locale-selector' },
      ],
      options: {
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
              label: 'Composable Storefront based on Oryx',
            },
          },
          options: {
            rules: [
              {
                colSpan: 3,
                height: '42px',
                justify: 'start',
                style: 'color: var(--oryx-color-primary-0, white)',
              },
              { query: { breakpoint: 'md' }, colSpan: 2 },
            ],
            link: '/',
          },
        },
        {
          type: 'oryx-search-box',
          options: {
            rules: [
              { colSpan: 6, width: 'auto' },
              { query: { breakpoint: 'md' }, colSpan: 4 },
            ],
          },
        },
        {
          type: 'oryx-composition',
          components: [
            {
              type: 'oryx-site-navigation-item',
              options: {
                visibility: {
                  hideByRule: 'USER.AUTHENTICATED',
                },
                label: 'login',
                icon: IconTypes.User,
                url: { type: 'login' },
              },
            },
            {
              type: 'oryx-site-navigation-item',
              options: {
                visibility: {
                  hideByRule: 'USER.!AUTHENTICATED',
                },
                contentBehavior: 'dropdown',
                label: 'USER.NAME',
                icon: IconTypes.User,
              },
              components: [{ type: 'oryx-auth-login-link' }],
            },
            {
              type: 'oryx-site-navigation-item',
              options: {
                label: 'cart',
                badge: 'CART.SUMMARY',
                icon: IconTypes.Cart,
                url: { type: 'cart' },
              },
            },
          ],
          options: {
            rules: [
              { colSpan: 3, layout: 'flex', justify: 'end' },
              { query: { breakpoint: 'md' }, colSpan: 2 },
            ],
          },
        },
      ],
      options: {
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
  ],
};
