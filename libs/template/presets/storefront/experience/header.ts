import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';

export const HeaderTemplate: ExperienceComponent = {
  id: 'header',
  type: 'Page',
  meta: { title: 'Header', route: '/_header' },
  components: [
    {
      type: 'oryx-composition',
      id: 'header-links',
      components: [
        {
          type: 'oryx-content-link',
          content: { data: { text: 'FREE DELIVERY & RETURNS' } },
          options: {
            url: '/',
            icon: IconTypes.Check,
            rules: [{ query: { breakpoint: Size.Sm }, hide: true }],
          },
        },
        {
          type: 'oryx-content-link',
          content: { data: { text: '100 DAY RETURN POLICY' } },
          options: {
            url: '/',
            icon: IconTypes.Check,
            rules: [{ query: { breakpoint: Size.Sm }, hide: true }],
          },
        },
        {
          type: 'oryx-content-link',
          content: { data: { text: 'CLICK & COLLECT' } },
          options: {
            url: '/',
            icon: IconTypes.Check,
            rules: [{ query: { breakpoint: Size.Sm }, hide: true }],
          },
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
      id: 'header-body',
      components: [
        {
          type: 'oryx-content-image',
          id: 'site-logo',
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
                style: 'color: var(--oryx-color-primary-12)',
              },
              { query: { breakpoint: Size.Md }, colSpan: 2 },
              { query: { breakpoint: Size.Sm }, colSpan: 2 },
            ],
            link: '/',
          },
        },
        {
          type: 'oryx-search-box',
          options: {
            rules: [
              { colSpan: 6, width: 'auto' },
              { query: { breakpoint: Size.Md }, colSpan: 4 },
              { query: { breakpoint: Size.Sm }, hide: true },
            ],
          },
        },
        {
          type: 'oryx-composition',
          id: 'header-actions',
          components: [
            {
              type: 'oryx-search-box',
              options: {
                float: true,
                rules: [
                  { query: { breakpoint: Size.Md }, hide: true },
                  { query: { breakpoint: Size.Lg }, hide: true },
                ],
              },
            },
            {
              type: 'oryx-site-navigation-item',
              options: {
                label: 'login',
                icon: IconTypes.User,
                url: { type: 'login' },
                rules: [{ hideByRule: 'USER.AUTHENTICATED' }],
              },
            },
            {
              type: 'oryx-site-navigation-item',
              options: {
                contentBehavior: 'dropdown',
                label: 'USER.NAME',
                icon: IconTypes.User,
                rules: [{ hideByRule: 'USER.!AUTHENTICATED' }],
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
              {
                query: { breakpoint: Size.Md },
                colSpan: 2,
              },
              { query: { breakpoint: Size.Sm }, colSpan: 2 },
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
            zIndex: 1,
            padding: '5px 0',
            gap: '5px',
            sticky: true,
            bleed: true,
          },
        ],
      },
    },
    {
      type: 'oryx-composition',
      options: {
        rules: [
          {
            layout: 'navigation',
            bleed: true,
            gap: '40px',
            background: 'var(--oryx-color-neutral-3)',
            // justify: 'center',
          },
        ],
      },
      components: [
        {
          type: 'oryx-content-link',
          content: { data: { text: 'All products' } },
          options: {
            url: '/search',
            icon: 'category',
          },
        },
        {
          type: 'oryx-content-link',
          content: { data: { text: 'fly out' } },
          options: {
            id: '9',
            type: 'category',
            rules: [
              {
                flyout: true,
              },
              {
                query: { composition: true },
                // bleed: true,
                layout: 'grid',
                background: 'blue',
              },
            ],
          },
          components: [
            // {
            //   type: 'oryx-content-link',
            //   options: { id: '16', type: 'category' },
            // },
            { type: 'oryx-product-category-list' },
            {
              type: 'oryx-content-link',
              options: { id: '5', type: 'category' },
            },
          ],
        },
        {
          type: 'oryx-content-link',
          content: { data: { text: 'fly out (bleed)' } },
          options: {
            id: '9',
            type: 'category',
            rules: [
              {
                flyout: true,
              },
              {
                query: { composition: true },
                bleed: true,
                layout: 'grid',
                background: 'blue',
              },
            ],
          },
          components: [
            // {
            //   type: 'oryx-content-link',
            //   options: { id: '16', type: 'category' },
            // },
            { type: 'oryx-product-category-list' },
            // {
            //   type: 'oryx-content-link',
            //   options: { id: '5', type: 'category' },
            // },
          ],
        },
        {
          type: 'oryx-content-link',
          content: { data: { text: 'dropdown' } },
          options: {
            id: '16',
            type: 'category',
            rules: [
              {
                dropdown: true,
              },
              {
                query: { composition: true },
                layout: 'grid',
                gap: 0,
              },
            ],
          },
          components: [
            {
              type: 'oryx-content-link',
              content: { data: { text: 'contact' } },
              options: { url: '/contact' },
            },
            {
              type: 'oryx-product-category-list',
              options: {
                rules: [{ dropdown: true, background: 'blue' }],
              },
            },
            // {
            //   type: 'oryx-content-link',
            //   options: {
            //     id: '5',
            //     type: 'category',
            //     rules: [
            //       {
            //         dropdown: true,
            //       },
            //     ],
            //   },
            //   components: [
            //     {
            //       type: 'oryx-content-link',
            //       options: { id: '16', type: 'category' },
            //     },
            //     {
            //       type: 'oryx-content-link',
            //       options: { id: '5', type: 'category' },
            //     },
            //   ],
            // },
          ],
        },
        {
          type: 'oryx-content-link',
          options: { id: '5', type: 'category' },
        },
        {
          type: 'oryx-content-link',
          options: { url: '/contact' },
          content: { data: { text: 'Contact' } },
        },
      ],
    },
  ],
};
