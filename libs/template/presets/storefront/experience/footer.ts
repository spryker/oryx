import { StaticComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

const banner = (graphic: string) => ({
  type: 'oryx-content-banner',
  content: { data: { graphic } },
});

const link = (text: string, id = '/', icon?: string) => ({
  type: 'oryx-content-link',
  options: { data: { id, text, icon } },
});

const selfServiceLinks = {
  type: 'oryx-composition',
  name: 'Links',
  options: {
    data: {
      rules: [
        {
          layout: 'column',
          columnCount: '3',
          gap: '0',
        },
      ],
    },
  },
  components: [
    {
      type: 'oryx-composition',
      name: 'Customer support',
      options: {
        data: { rules: [{ layout: 'flex', vertical: true, align: 'start' }] },
      },
      components: [
        link('Contact us', '/contact'),
        link('Help center'),
        link('Payment'),
        link('Shipping information'),
        link('Returns & Exchanges'),
        link('Withdrawal rights'),
      ],
    },
    {
      type: 'oryx-composition',
      name: 'Our promises',
      options: {
        data: { rules: [{ layout: 'flex', vertical: true, align: 'start' }] },
      },
      components: [
        link('Free delivery', '/', IconTypes.Carrier),
        link('100-day return policy', '/', IconTypes.Parcel),
        link('Click & Collect', '/', 'storefront'),
      ],
    },
    {
      type: 'oryx-composition',
      name: 'About us',
      options: {
        data: { rules: [{ layout: 'flex', vertical: true, align: 'start' }] },
      },
      components: [
        link('Company'),
        link('Jobs & Career'),
        link('Our stores'),
        link('Our brands'),
        link('Press'),
        link('Corporate information'),
      ],
    },
  ],
};

const checkoutLinks = {
  type: 'oryx-composition',
  name: 'checkout methods',
  options: {
    data: {
      rules: [
        { layout: 'column', columnCount: '3', gap: '6px' },
        {
          query: {
            childs: true,
          },
          background: 'var(--oryx-color-neutral-1)',
          padding: '8px 15px',
          radius: 5,
          ratio: '4/3',
        },
      ],
    },
  },
  components: [
    banner('mastercard'),
    banner('visa'),
    banner('paypal'),
    banner('klarna'),
    banner('applePay'),
    banner('googlePay'),
    banner('dhl'),
    banner('hermes'),
    banner('dhlExpress'),
  ],
};

const socialLinks = {
  type: 'oryx-composition',
  name: 'socials',
  options: { data: { rules: [{ layout: 'list' }] } },
  components: [
    {
      type: 'oryx-composition',
      name: 'native apps',
      options: {
        data: {
          rules: [{ layout: 'column', columnCount: '2', gap: '6px' }],
        },
      },
      components: [banner('playStore'), banner('appleStore')],
    },
    {
      type: 'oryx-composition',
      name: 'socials',
      options: {
        data: {
          rules: [{ layout: 'flex', vertical: false, align: 'center' }],
        },
      },
      components: [
        banner('pinterest'),
        banner('youtube'),
        banner('instagram'),
        banner('facebook'),
      ],
    },
  ],
};

const legalLinks = {
  type: 'oryx-composition',
  name: 'legal links',
  components: [
    link('©️ 2023 Spryker'),
    link('Imprint'),
    link('Terms & conditions', '/article/terms'),
    link('Privacy Notice', '/article/privacy'),
    link('Data preference'),
    link('Condition of use'),
  ],
  options: { data: { rules: [{ layout: 'flex', divider: true }] } },
};

export const FooterTemplate: StaticComponent = {
  id: 'footer',
  type: 'Page',
  meta: { title: 'Footer', route: '/_footer' },
  components: [
    {
      type: 'oryx-composition',
      name: 'footer',
      components: [
        {
          type: 'oryx-composition',
          name: 'Self service',
          options: {
            data: { rules: [{ layout: 'split' }] },
          },
          components: [
            selfServiceLinks,
            {
              type: 'oryx-composition',
              name: 'right',
              options: {
                data: { rules: [{ layout: 'column', columnCount: 2 }] },
              },
              components: [checkoutLinks, socialLinks],
            },
          ],
        },
        legalLinks,
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'flex',
              vertical: true,
              divider: true,
              gap: '40px 18px',
            },
          ],
        },
      },
    },
    { type: 'oryx-site-notification-center' },
  ],
  options: {
    data: {
      rules: [
        {
          layout: 'flex',
          divider: true,
          top: '100%',
          background: 'var(--oryx-color-neutral-3)',
          padding: '30 0',
          bleed: true,
          sticky: true,
        },
      ],
    },
  },
};
