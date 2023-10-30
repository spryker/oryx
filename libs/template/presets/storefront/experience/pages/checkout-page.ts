import { ExperienceComponent } from '@spryker-oryx/experience';
import { featureVersion } from '@spryker-oryx/utilities';

const checkoutInformation = (): ExperienceComponent => {
  const components: ExperienceComponent[] = [];
  if (featureVersion >= '1.2')
    components.push({
      type: 'oryx-checkout-heading',
      options: { rules: [{ padding: '30px 0 0 0' }] },
    });
  components.push({
    type: 'oryx-cart-entries',
    options: { readonly: true },
  });

  const gap = featureVersion >= '1.2' ? '0' : '20px';

  return {
    type: 'oryx-composition',
    id: 'checkout-information',
    components: [
      {
        type: 'oryx-checkout-orchestrator',
        components: [
          { type: 'oryx-checkout-account' },
          { type: 'oryx-checkout-shipping-address' },
          { type: 'oryx-checkout-billing-address' },
          { type: 'oryx-checkout-shipping-method' },
          { type: 'oryx-checkout-payment-method' },
        ],
        options: { rules: [{ layout: 'list', gap: '30px' }] },
      },
      ...components,
    ],
    options: {
      rules: [
        { hideByRule: 'CART.EMPTY' },
        { gap, layout: 'flex', vertical: true, align: 'stretch' },
      ],
    },
  };
};

export const checkoutPage: ExperienceComponent = {
  id: 'checkout-page',
  type: 'Page',
  meta: {
    title: 'Checkout Page',
    route: '/checkout',
    description: 'Checkout Page Description',
  },
  components: [
    featureVersion >= '1.2'
      ? {
          ref: 'header',
        }
      : {},
    {
      type: 'oryx-composition',
      options: {
        rules: [
          { layout: 'split-main', padding: '30px 0' },
          { query: { breakpoint: 'sm' }, gap: '0' },
        ],
      },
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
              { hideByRule: 'CART.!EMPTY' },
              {
                colSpan: 2,
                background: 'var(--oryx-color-neutral-3)',
                width: '66%',
                margin: 'auto',
                padding: '20px',
                radius: '4px',
                style: `display: grid;gap:14px;justify-items:center;`,
              },
            ],
          },
        },
        checkoutInformation(),
        {
          type: 'oryx-composition',
          id: 'checkout-totals',
          options: {
            rules: [
              { hideByRule: 'CART.EMPTY' },
              { sticky: true, top: '108px' },
            ],
          },
          components: [
            {
              type: 'oryx-cart-totals',
              components: [
                { type: 'oryx-cart-totals-subtotal' },
                {
                  type: 'oryx-cart-totals-discount',
                  options: {
                    discountRowsAppearance: 'collapsed',
                  },
                },
                { type: 'oryx-cart-totals-tax' },
                { type: 'oryx-cart-totals-delivery' },
                { type: 'oryx-cart-totals-total' },
              ],
            },
            {
              type: 'oryx-content-text',
              content: {
                data: {
                  text: '<p>The <a href="/article/terms-and-conditions" target="_blank" data-color="primary">Terms and conditions</a> apply.<br/>Please also see our <a href="/article/privacy" target="_blank"  data-color="primary">Privacy notice</a>.</p>',
                },
              },
            },
            { type: 'oryx-checkout-place-order' },
          ],
        },
      ],
    },
    featureVersion >= '1.2'
      ? {
          ref: 'footer',
        }
      : {},
  ],
};
