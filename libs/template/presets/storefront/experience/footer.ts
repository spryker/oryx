import { StaticComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

const banner = (graphic: string) => ({
  type: 'oryx-content-banner',
  content: { data: { graphic } },
});

const heading = (text: string, rules = {}) => ({
  type: 'oryx-content-text',
  content: { data: { text } },
  options: { data: { tag: 'button', rules: [rules] } },
});

const link = (text: string, id = '/', icon?: string) => ({
  type: 'oryx-content-link',
  options: { data: { id, text, icon, multiLine: true } },
});

const legalLinks = {
  type: 'experience-composition',
  name: 'legal links',
  components: [
    link('©️ 2023 Spryker'),
    link('Imprint'),
    link('Terms & conditions'),
    link('Privacy Notice'),
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
      type: 'experience-composition',
      name: 'footer',
      components: [
        {
          type: 'experience-composition',
          name: 'Self service',
          options: {
            data: { rules: [{ layout: 'column' }] },
          },
          components: [
            {
              type: 'experience-composition',
              options: {
                data: {
                  rules: [{ layout: 'list', gap: 0, colSpan: 2, rowSpan: 2 }],
                },
              },
              components: [
                heading('Customer Support'),
                link('Contact us', '/contact'),
                link('Help center'),
                link('Payment'),
                link('Shipping information'),
                link('Returns & Exchanges'),
                link('Withdrawal rights'),
              ],
            },

            {
              type: 'experience-composition',
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
              type: 'experience-composition',
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
              type: 'experience-composition',
              options: {
                data: { rules: [{ layout: 'list', gap: 0, colSpan: 2 }] },
              },
              components: [
                heading('Safe Payment methods'),
                {
                  type: 'experience-composition',
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
              type: 'experience-composition',
              options: {
                data: {
                  rules: [
                    { layout: 'list', gap: 0, colSpan: 2, gridColumn: 11 },
                  ],
                },
              },
              components: [
                heading('Spryker Apps'),
                {
                  type: 'experience-composition',
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
              type: 'experience-composition',
              options: {
                data: { rules: [{ layout: 'list', gap: 0, colSpan: 2 }] },
              },
              components: [
                heading('Shipping partners'),
                {
                  type: 'experience-composition',
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
              type: 'experience-composition',
              options: {
                data: {
                  rules: [
                    { layout: 'list', gap: 0, colSpan: 2, gridColumn: 11 },
                  ],
                },
              },
              components: [
                heading('You can also find us on'),
                {
                  type: 'experience-composition',
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
