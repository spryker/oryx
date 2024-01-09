import { ExperienceComponent } from '@spryker-oryx/experience';

export const cartCreatePage: ExperienceComponent = {
  id: 'cart-create-page-content',
  type: 'oryx-composition',
  components: [
    {
      type: 'oryx-content-text',
      content: {
        data: {
          text: `
            <oryx-heading tag="h1" typography="h3">Create cart</oryx-heading>
            <p style="margin-block: 20px 0;">
              You can create multiple carts to organize your running orders
            </p>
          `,
        },
      },
    },
    { type: 'oryx-cart-edit' },
  ],
  options: {
    rules: [{ layout: 'list', gap: '20px' }],
  },
};
