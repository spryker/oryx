import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';

export const contactPage: ExperienceComponent = {
  id: 'contact-page',
  type: 'Page',
  meta: {
    title: 'Contact Page',
    route: '/contact',
    description: 'Contact Page Description',
  },
  options: {
    rules: [
      {
        layout: 'list',
        padding: '30px 0',
      },
    ],
  },
  components: [
    {
      type: 'oryx-site-breadcrumb',
      options: {
        rules: [{ query: { breakpoint: Size.Sm }, hide: true }],
      },
    },
    {
      type: 'oryx-content-link',
      content: {
        data: {
          text: 'This is Contact Page element. Remove me when the page is implemented',
        },
      },
      options: {
        type: 'rawUrl',
        url: '/contact',
        icon: IconTypes.Check,
        rules: [
          {
            layout: 'list',
            padding: '10px',
            background: 'var(--oryx-color-primary-3)',
          },
        ],
      },
    },

    {
      type: 'oryx-composition',

      options: {
        rules: [
          {
            layout: 'grid',
          },
        ],
      },
      components: [
        {
          type: 'oryx-composition',
          components: [
            {
              type: 'oryx-content-link',
              content: { data: { text: 'Catalog' } },
              options: {
                url: '/search',
                icon: 'location_on',
              },
            },
            {
              type: 'oryx-content-link',
              content: { data: { text: 'Smart Wearables' } },
              options: {
                url: '/category/9',
              },
            },
            {
              type: 'oryx-content-link',
              content: { data: { text: 'Food' } },
              options: {
                url: '/category/16',
              },
            },
          ],
          options: {
            rules: [
              {
                layout: 'navigation',
                vertical: true,
                gap: 0,
              },
            ],
          },
        },
        {
          type: 'oryx-composition',
          components: [
            {
              type: 'oryx-content-link',
              content: { data: { text: 'Catalog' } },
              options: {
                url: '/search',
              },
            },
            {
              type: 'oryx-content-link',
              content: { data: { text: 'Smart Wearables' } },
              options: {
                url: '/category/9',
              },
            },
            {
              type: 'oryx-content-link',
              content: { data: { text: 'Food' } },
              options: {
                url: '/category/16',
              },
            },
          ],
          options: {
            rules: [
              {
                layout: 'navigation',
                gap: 0,
              },
            ],
          },
        },
      ],
    },
  ],
};
