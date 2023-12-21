import { ExperienceComponent } from '@spryker-oryx/experience';

export const cartsPage: ExperienceComponent = {
  id: 'carts-page-content',
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
          content: {
            data: {
              text: `
                <oryx-button type="text" href="/my-account/create-cart">
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
};
