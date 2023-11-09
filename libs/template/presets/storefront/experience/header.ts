import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size, featureVersion } from '@spryker-oryx/utilities';

const siteLinks = (): ExperienceComponent[] => {
  const components: ExperienceComponent[] = [
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
  ];
  return components;
};

const siteContextComponents = (options?: {
  priceModeSelector?: boolean;
}): ExperienceComponent[] => {
  const components: ExperienceComponent[] = [];

  if (options?.priceModeSelector && featureVersion >= '1.1') {
    components.push({ type: 'oryx-price-mode-selector' });
  }

  components.push({ type: 'oryx-site-currency-selector' });
  components.push({ type: 'oryx-site-locale-selector' });

  components[0].options = { rules: [{ style: 'margin-inline-start: auto' }] };

  return components;
};

export const topHeader = (options?: {
  priceModeSelector?: boolean;
}): ExperienceComponent[] => {
  return [
    {
      type: 'oryx-composition',
      id: 'header-links',
      components: [...siteLinks(), ...siteContextComponents(options)],
      options: {
        rules: [
          {
            layout:
              featureVersion >= '1.2'
                ? {
                    type: 'flex',
                    bleed: true,
                  }
                : 'flex',
            background: 'hsl(0, 0%, 9.0%)',
            padding: '10px 0',
            gap: '10px',
            align: 'center',
            style: 'color: white',
            ...(featureVersion >= '1.2' ? {} : { bleed: true }),
          },
        ],
      },
    },
  ];
};

export const mainHeader = (): ExperienceComponent[] => {
  return [
    {
      type: 'oryx-composition',
      id: 'header-body',
      name: 'Composition',
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
            layout:
              featureVersion >= '1.2'
                ? {
                    type: 'column',
                    sticky: true,
                    bleed: true,
                    zIndex: 1,
                  }
                : 'column',
            background: 'var(--oryx-color-primary-9)',
            align: 'center',
            padding: '5px 0',
            gap: '5px',
            ...(featureVersion >= '1.2'
              ? {}
              : { bleed: true, sticky: true, zIndex: 1 }),
          },
        ],
      },
    },
  ];
};

export const categoryNavigation = (
  categories: (string | number)[] = []
): ExperienceComponent[] => {
  if (featureVersion >= '1.3') {
    const categoryLinks = categories.map((id) => ({
      type: 'oryx-content-link',
      options: { id, type: 'category' },
    }));
    return [
      {
        type: 'oryx-composition',
        options: {
          rules: [
            {
              layout: {
                type: 'navigation',
                bleed: true,
                sticky: true,
                shadow: true,
              },
              top: '78px',
              gap: '40px',
              background: 'var(--oryx-color-neutral-1)',
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
          ...categoryLinks,
        ],
      },
    ];
  } else {
    return [];
  }
};

export const HeaderTemplate: ExperienceComponent = {
  id: 'header',
  type: 'Page',
  meta: { title: 'Header', route: '/_header' },
  components: [
    ...topHeader(),
    ...mainHeader(),
    ...categoryNavigation(['2', '5', '9', '11']),
  ],
};
