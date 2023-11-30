import { ExperienceComponent } from '@spryker-oryx/experience';
import { featureVersion } from '@spryker-oryx/utilities';

const cartEntries = (): ExperienceComponent => {
  const components: ExperienceComponent[] = [];
  if (featureVersion >= '1.2') components.push({ type: 'oryx-cart-heading' });
  components.push({ type: 'oryx-cart-entries' });

  return {
    type: 'oryx-composition',
    id: 'cart-entries',
    components,
    options: { rules: [{ layout: 'list' }] },
  };
};

export const cartPage: ExperienceComponent = {
  id: 'cart-page',
  type: 'Page',
  meta: {
    title: 'Cart Page',
    route: '/cart',
    description: 'Cart Page Description',
  },
  components: [
    featureVersion >= '1.2'
      ? {
          ref: 'header',
        }
      : {},
    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-content-text',
          content: {
            data: {
              text: `
          <oryx-icon type="shopping_cart" style="--oryx-icon-size: 40px;"></oryx-icon>
          <p>Your shopping cart is empty</p><oryx-button>
          <a href="/search">Shop now</a></oryx-button>`,
            },
          },
          options: {
            rules: [
              { hideByRule: 'CORE.SERVER||CART.!EMPTY' },
              {
                colSpan: 2,
                background: 'var(--oryx-color-neutral-3)',
                width: '66%',
                margin: 'auto',
                padding: '20px',
                radius: '4px',
                style: `display: grid;gap:14px;justify-items: center;`,
              },
            ],
          },
        },
        cartEntries(),
        {
          type: 'oryx-composition',
          id: 'cart-totals',
          components: [
            {
              type: 'oryx-cart-totals',
              components: [
                { type: 'oryx-cart-totals-subtotal' },
                { type: 'oryx-cart-totals-discount' },
                { type: 'oryx-cart-totals-tax' },
                { type: 'oryx-cart-totals-delivery' },
                { type: 'oryx-cart-totals-total' },
              ],
            },
            { type: 'oryx-checkout-link' },
            featureVersion >= '1.4'
              ? {
                  type: 'oryx-cart-coupon',
                }
              : {},
          ],
          options: {
            rules: [
              {
                layout: { sticky: true },
                top: '108px',
                ...(featureVersion >= '1.2' ? {} : { sticky: true }),
              },
            ],
          },
        },
      ],
      options: {
        rules: [
          {
            layout:
              featureVersion >= '1.2'
                ? { type: 'split', columnWidthType: 'main' }
                : 'split-main',
            padding: '30px 0',
          },
          { query: { breakpoint: 'sm' }, gap: '0' },
        ],
      },
    },
    featureVersion >= '1.2'
      ? {
          ref: 'footer',
        }
      : {},
  ],
};
