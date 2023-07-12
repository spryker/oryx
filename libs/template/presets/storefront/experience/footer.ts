import { StaticComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

const image = (graphic: string) => ({
  type: 'oryx-content-image',
  content: { data: { graphic, alt: graphic } },
});

const heading = (text: string, rule = {}) => ({
  type: 'oryx-content-text',
  content: { data: { text: `<b>${text}</b>` } },
  options: { data: { rules: [rule] } },
});

const link = (text: string, url = '/', icon?: string) => ({
  type: 'oryx-content-link',
  options: { data: { url, icon } },
  content: { data: { text } },
});

const legalLinks = {
  type: 'oryx-composition',
  name: 'legal links',
  id: 'bottomFooter',
  components: [
    {
      type: 'oryx-content-text',
      content: { data: { text: `©️ 2023 Spryker` } },
    },
    link('Imprint', '/faq/imprint'),
    link('Terms & conditions', '/article/terms-and-conditions'),
    link('Privacy Notice', '/article/privacy'),
    link('Data preference'),
    link('Condition of use'),
  ],
  options: {
    data: {
      rules: [
        { layout: 'flex', divider: true, gap: '0 20px', padding: '20px 0 0' },
      ],
    },
  },
};

const customerSupport = {
  type: 'oryx-content-text',
  content: {
    data: {
      text: `<b>Customer Support</b><br/>
      <a href="/contact">Contact us</a><br/>
      <a href="/">Help center</a><br/>
      <a href="/">Payment</a><br/>
      <a href="/">Shipping information</a><br/>
      <a href="/">Returns & Exchanges</a><br/>
      <a href="/">Withdrawal rights</a>`,
    },
  },
};

const promises = {
  type: 'oryx-composition',
  options: { data: { rules: [{ layout: 'list', gap: 0 }] } },
  components: [
    heading('Our promises'),
    link('Free delivery', '/', IconTypes.Carrier),
    link('100-day return policy', '/', IconTypes.Parcel),
    link('Click & Collect', '/', 'storefront'),
  ],
};

const aboutUs = {
  type: 'oryx-content-text',
  content: {
    data: {
      text: `<b>About us</b><br/>
        <a href="/">Company</a><br/>
        <a href="/">Jobs & Career</a><br/>
        <a href="/">Our stores</a><br/>
        <a href="/">Our brands</a><br/>
        <a href="/">Press</a><br/>
        <a href="/">Corporate information</a>
        `,
    },
  },
};

const selfServiceLinks = {
  type: 'oryx-composition',
  name: 'Self service',
  options: {
    data: {
      rules: [
        { layout: 'column', columnCount: 3 },
        { query: { breakpoint: 'md' }, columnCount: 2 },
        { query: { breakpoint: 'sm' }, columnCount: 2 },
      ],
    },
  },
  components: [customerSupport, promises, aboutUs],
};

const paymentLinks = {
  type: 'oryx-composition',
  id: 'paymentLinks',
  options: { data: { rules: [{ layout: 'list', colSpan: 2 }] } },
  components: [
    heading('Safe Payment methods'),
    {
      type: 'oryx-composition',
      options: {
        data: {
          rules: [
            { layout: 'column', columnCount: 3 },
            { query: { breakpoint: 'md' }, columnCount: 2 },
            {
              query: { childs: true },

              ratio: '4/3',
              background: 'var(--oryx-color-neutral-1)',
              radius: 5,
              padding: '0.5vw',
            },
          ],
        },
      },
      components: [
        image('mastercard'),
        image('visa'),
        image('paypal'),
        image('klarna'),
        image('applePay'),
        image('googlePay'),
      ],
    },
  ],
};

const shippingLinks = {
  type: 'oryx-composition',
  id: 'shippingLinks',
  options: { data: { rules: [{ layout: 'list', colSpan: 2 }] } },
  components: [
    heading('Shipping partners'),
    {
      type: 'oryx-composition',
      options: {
        data: {
          rules: [
            { layout: 'column', columnCount: 3 },
            { query: { breakpoint: 'md' }, columnCount: 2 },
            {
              query: { childs: true },

              ratio: '4/3',
              background: 'var(--oryx-color-neutral-1)',
              radius: 5,
              padding: '0.5vw',
            },
          ],
        },
      },
      components: [image('dhl'), image('hermes'), image('dhlExpress')],
    },
  ],
};

const mobileAppsLinks = {
  type: 'oryx-composition',
  id: 'mobileAppsLinks',
  options: { data: { rules: [{ layout: 'list', gridColumn: 4, colSpan: 2 }] } },
  components: [
    heading('Spryker apps'),
    {
      type: 'oryx-composition',
      options: {
        data: { rules: [{ layout: 'flex', align: 'center' }] },
      },
      components: [image('playStore'), image('appleStore')],
    },
  ],
};

const socialLinks = {
  type: 'oryx-composition',
  options: {
    data: {
      rules: [{ layout: 'list', gridColumn: 4, colSpan: 2 }],
    },
  },
  components: [
    heading('You can also find us on'),
    {
      type: 'oryx-composition',
      options: {
        data: { rules: [{ layout: 'flex', align: 'center', gap: 20 }] },
      },
      components: [
        image('pinterest'),
        image('youtube'),
        image('instagram'),
        image('facebook'),
      ],
    },
  ],
};

const otherLinks = {
  type: 'oryx-composition',
  options: { data: { rules: [{ layout: 'list' }] } },
  components: [
    {
      type: 'oryx-composition',
      options: { data: { rules: [{ layout: 'column', columnCount: 6 }] } },
      components: [paymentLinks, mobileAppsLinks],
    },
    {
      type: 'oryx-composition',
      options: {
        data: {
          rules: [{ layout: 'column', columnCount: 6 }],
        },
      },
      components: [shippingLinks, socialLinks],
    },
  ],
};

const topFooter = {
  type: 'oryx-composition',
  id: 'topFooter',
  options: { data: { rules: [{ layout: 'split', gap: '10px' }] } },
  components: [selfServiceLinks, otherLinks],
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
          components: [topFooter, legalLinks],
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
      ],
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
          typography: 'small',
          style: 'line-height: 24px;',
        },
      ],
    },
  },
};
