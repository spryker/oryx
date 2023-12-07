import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const cartCreatePage: ExperienceComponent = {
  id: 'cart-create-page',
  type: 'Page',
  meta: {
    title: 'Create Cart',
    //TODO: replace with final route
    route: '/create-cart',
  },
  components: [
    {
      ref: 'header',
    },
    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-site-breadcrumb',
          options: {
            rules: [{ query: { breakpoint: Size.Sm }, hide: true }],
          },
        },
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
        rules: [{ layout: 'list', gap: '20px', padding: '30px 0 0' }],
      },
    },
  ],
};
