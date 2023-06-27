import { StaticComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

const banner = (graphic: string) => ({
  type: 'oryx-content-banner',
  content: { data: { graphic } },
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
  components: [
    link('©️ 2023 Spryker'),
    link('Imprint'),
    link('Terms & conditions', '/article/terms-and-conditions'),
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
          options: { data: { rules: [{ layout: 'column' }] } },
          components: [
            {
              type: 'oryx-composition',
              options: {
                data: {
                  rules: [{ layout: 'list', gap: 0, colSpan: 2, rowSpan: 2 }],
                },
              },
              components: [
                {
                  type: 'oryx-content-text',
                  content: {
                    data: {
                      text: `<b>Customer Support</b>`,
                    },
                  },
                },
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
              options: {
                data: {
                  rules: [{ layout: 'list', gap: 0, colSpan: 2, rowSpan: 2 }],
                },
              },
              components: [
                heading('Our promises'),
                link('Free delivery', '/', IconTypes.Carrier),
                link('100-day return policy', '/', IconTypes.Parcel),
                link('Click & Collect', '/', 'storefront'),
              ],
            },
            {
              type: 'oryx-composition',
              options: {
                data: {
                  rules: [{ layout: 'list', gap: 0, colSpan: 2, rowSpan: 2 }],
                },
              },
              components: [
                heading('About Us'),
                link('Company'),
                link('Jobs & Career'),
                link('Our stores'),
                link('Our brands'),
                link('Press'),
                link('Corporate information'),
              ],
            },
            {
              type: 'oryx-composition',
              options: {
                data: { rules: [{ layout: 'list', gap: 0, colSpan: 2 }] },
              },
              components: [
                heading('Safe Payment methods'),
                {
                  type: 'oryx-composition',
                  options: {
                    data: {
                      rules: [
                        { layout: 'flex', gap: 10, margin: '12px 0' },
                        {
                          query: { childs: true },
                          width: 'calc(33% - 30px)',
                          padding: '8px 10px',
                          ratio: '4/3',
                          background: 'var(--oryx-color-neutral-1)',
                          radius: 5,
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
                  ],
                },
              ],
            },
            {
              type: 'oryx-composition',
              options: {
                data: {
                  rules: [
                    { layout: 'list', gap: 0, colSpan: 2, gridColumn: 10 },
                  ],
                },
              },
              components: [
                heading('Spryker Apps'),
                {
                  type: 'oryx-composition',
                  options: {
                    data: {
                      rules: [{ layout: 'flex', gap: '6px', margin: '12px 0' }],
                    },
                  },
                  components: [banner('playStore'), banner('appleStore')],
                },
              ],
            },
            {
              type: 'oryx-composition',
              options: {
                data: { rules: [{ layout: 'list', gap: 0, colSpan: 2 }] },
              },
              components: [
                heading('Shipping partners'),
                {
                  type: 'oryx-composition',
                  options: {
                    data: {
                      rules: [
                        { layout: 'flex', gap: 10, margin: '12px 0' },
                        {
                          query: { childs: true },
                          width: 'calc(33% - 30px)',
                          padding: '8px 10px',
                          ratio: '4/3',
                          background: 'var(--oryx-color-neutral-1)',
                          radius: 5,
                        },
                      ],
                    },
                  },
                  components: [
                    banner('dhl'),
                    banner('hermes'),
                    banner('dhlExpress'),
                  ],
                },
              ],
            },
            {
              type: 'oryx-composition',
              options: {
                data: {
                  rules: [
                    { layout: 'list', gap: 0, colSpan: 2, gridColumn: 10 },
                  ],
                },
              },
              components: [
                heading('You can also find us on'),
                {
                  type: 'oryx-composition',
                  options: {
                    data: {
                      rules: [
                        {
                          layout: 'flex',
                          align: 'center',
                          gap: '25px',
                          margin: '12px 0',
                        },
                      ],
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
