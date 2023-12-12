import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { featureVersion } from '@spryker-oryx/utilities';

const image = (graphic: string) => ({
  type: 'oryx-content-image',
  content: { data: { graphic, alt: graphic } },
});

const heading = (content: string, rule = {}) => ({
  type: 'oryx-content-text',
  content: { data: { text: text(content) } },
  options: { rules: [rule] },
});

const text = (text: string): string => {
  return featureVersion >= '1.4'
    ? `<strong>${text}</strong>`
    : `<b>${text}</b>`;
};

const link = (text: string, url = '/', icon?: string) => ({
  type: 'oryx-content-link',
  options: { url, icon },
  content: { data: { text } },
});

const legalLinks: ExperienceComponent = {
  type: 'oryx-composition',
  name: 'legal links',
  id: 'legal-links',
  components: [
    {
      type: 'oryx-content-text',
      content: { data: { text: `©️ 2023 Spryker` } },
    },
    ...(featureVersion >= '1.4'
      ? [
          {
            type: 'oryx-content-list',
            options: {
              tags: 'legal',
              rules: [
                {
                  layout: {
                    divider: true,
                  },
                  style: 'display: contents;',
                },
              ],
            },
          },
        ]
      : [
          link('Imprint', '/faq/imprint'),
          link('Terms & conditions', '/article/terms-and-conditions'),
          link('Privacy Notice', '/article/privacy'),
          link('Data preference'),
          link('Condition of use'),
        ]),
  ],
  options: {
    rules: [
      {
        layout:
          featureVersion >= '1.2'
            ? {
                type: 'flex',
                divider: true,
              }
            : 'flex',
        ...(featureVersion >= '1.4'
          ? { gap: '40px 20px' }
          : { gap: '0 20px', padding: '20px 0 0' }),
        ...(featureVersion >= '1.2' ? {} : { divider: true }),
      },
    ],
  },
};

const customerSupport = {
  type: 'oryx-content-text',
  id: 'customer-support',
  content: {
    data: {
      text: `${text('Customer Support')}<br/>
        <a href="/contact">Contact us</a><br/>
        <a href="/">Help center</a><br/>
        <a href="/">Payment</a><br/>
        <a href="/">Shipping information</a><br/>
        <a href="/">Returns & Exchanges</a><br/>
        <a href="/">Withdrawal rights</a>`,
    },
  },
};

const promises: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'corporate-promises',
  options: { rules: [{ layout: 'list', gap: '0' }] },
  components: [
    heading('Our promises'),
    link('Free delivery', '/', IconTypes.Carrier),
    link('100-day return policy', '/', IconTypes.Parcel),
    link('Click & Collect', '/', 'storefront'),
  ],
};

const aboutUs = {
  type: 'oryx-content-text',
  id: 'corporate-info',
  content: {
    data: {
      text: `${text('About us')}<br/>
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

const selfService: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'self-service',
  name: 'Self service',
  options: {
    rules: [
      { layout: 'column', columnCount: 3 },
      { query: { breakpoint: 'md' }, columnCount: 2 },
      { query: { breakpoint: 'sm' }, columnCount: 2 },
    ],
  },
  components: [customerSupport, promises, aboutUs],
};

const paymentLinks: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'payment',
  options: { rules: [{ layout: 'list', colSpan: 2 }] },
  components: [
    heading('Safe Payment methods'),
    {
      type: 'oryx-composition',
      id: 'payment-links',
      options: {
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

const shippingLinks: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'shipping',
  options: { rules: [{ layout: 'list', colSpan: 2 }] },
  components: [
    heading('Shipping partners'),
    {
      type: 'oryx-composition',
      id: 'shipping-links',
      options: {
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
      components: [image('dhl'), image('hermes'), image('dhlExpress')],
    },
  ],
};

const mobileAppsLinks: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'apps',
  options: { rules: [{ layout: 'list', gridColumn: 4, colSpan: 2 }] },
  components: [
    heading('Spryker apps'),
    {
      type: 'oryx-composition',
      id: 'app-links',
      options: {
        rules: [{ layout: 'flex', align: 'center' }],
      },
      components: [image('playStore'), image('appleStore')],
    },
  ],
};

const socialLinks: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'social',
  options: {
    rules: [{ layout: 'list', gridColumn: 4, colSpan: 2 }],
  },
  components: [
    heading('You can also find us on'),
    {
      type: 'oryx-composition',
      id: 'social-links',
      options: {
        rules: [{ layout: 'flex', align: 'center', gap: 20 }],
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

const externalLinks: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'external-links',
  options: { rules: [{ layout: 'list' }] },
  components: [
    {
      type: 'oryx-composition',
      options: { rules: [{ layout: 'column', columnCount: 6 }] },
      components: [paymentLinks, mobileAppsLinks],
    },
    {
      type: 'oryx-composition',
      options: { rules: [{ layout: 'column', columnCount: 6 }] },
      components: [shippingLinks, socialLinks],
    },
  ],
};

const siteLinks: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'site-links',
  options: { rules: [{ layout: 'split', gap: '10px' }] },
  components: [selfService, externalLinks],
};

export const FooterTemplate: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'footer',
  components: [
    {
      type: 'oryx-composition',
      id: 'footerLinks',
      name: 'footer',
      components: [
        {
          type: 'oryx-composition',
          components: [siteLinks, legalLinks],
          options: {
            rules: [
              {
                layout:
                  featureVersion >= '1.2'
                    ? {
                        type: 'flex',
                        vertical: true,
                        divider: true,
                      }
                    : 'flex',
                gap: '40px 18px',
                ...(featureVersion >= '1.2'
                  ? {}
                  : { divider: true, vertical: true }),
              },
            ],
          },
        },
      ],
    },
    { type: 'oryx-site-notification-center' },
  ],
  options: {
    rules: [
      {
        layout:
          featureVersion >= '1.2'
            ? { type: 'flex', bleed: true, sticky: true }
            : 'flex',
        top: '100%',
        background: 'var(--oryx-color-neutral-3)',
        padding: '30 0',
        typography: 'small',
        style: 'line-height: 24px;',
        ...(featureVersion >= '1.2'
          ? {}
          : { divider: true, bleed: true, sticky: true }),
      },
    ],
  },
};
