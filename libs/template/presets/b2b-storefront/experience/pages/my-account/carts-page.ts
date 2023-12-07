import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const cartsPage: ExperienceComponent = {
  id: 'carts-page',
  type: 'Page',
  meta: {
    title: 'Carts',
    // TODO: replace with final url
    route: '/carts',
    description: 'Carts Page',
  },
  options: { rules: [{ layout: 'list', padding: '30px 0' }] },
  components: [
    {
      type: 'oryx-site-breadcrumb',
      options: { rules: [{ query: { breakpoint: Size.Sm }, hide: true }] },
    },
    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-composition',
          components: [
            {
              type: 'oryx-content-text',
              content: {
                data: {
                  text: `
                <oryx-heading tag="h1" typography="h3">My carts</oryx-heading>
              `,
                },
              },
            },
            {
              type: 'oryx-content-text',
              // TODO: replace hardcoded url with final one
              content: {
                data: {
                  text: `
                <oryx-button type="text" href="/create-cart">
                  Create cart
                </oryx-button>
              `,
                },
              },
            },
          ],
          options: { rules: [{ layout: 'flex', justify: 'space-between' }] },
        },
        {
          type: 'oryx-content-text',
          content: {
            data: {
              text: `Manage your carts with ease. Create, track, and shop effortlessly. 
                    Need help? Our support team is here for you. Enjoy your shopping!`,
            },
          },
        },
        {
          type: 'oryx-cart-list',
          options: { rules: [{ layout: 'list', gap: '10px' }] },
        },
      ],
      options: { rules: [{ layout: 'list' }] },
    },
  ],
};
