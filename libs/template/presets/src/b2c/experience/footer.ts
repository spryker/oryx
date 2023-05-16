import { StaticComponent } from '@spryker-oryx/experience';

export const FooterTemplate: StaticComponent = {
  id: 'footer',
  type: 'Page',
  meta: { title: 'Footer', route: '/_footer' },
  components: [
    { type: 'oryx-site-notification-center' },
    {
      type: 'experience-composition',
      components: [
        {
          type: 'experience-composition',
          components: [
            {
              type: 'experience-composition',
              components: [
                {
                  type: 'experience-composition',
                  components: [
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/contact', text: 'Contact us' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Help center' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Payment' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: {
                        data: { id: '/', text: 'Shipping information' },
                      },
                    },
                    {
                      type: 'oryx-content-link',
                      options: {
                        data: { id: '/', text: 'Returns & Exchanges' },
                      },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Withdrawal rights' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Free delivery' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: {
                        data: { id: '/', text: '100-day return policy' },
                      },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Click & Collect' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Company' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Jobs & Career' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Our stores' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Our brands' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: { data: { id: '/', text: 'Press' } },
                    },
                    {
                      type: 'oryx-content-link',
                      options: {
                        data: { id: '/', text: 'Corporate information' },
                      },
                    },
                  ],
                  options: {
                    data: { rules: [{ layout: 'text', columnCount: '3' }] },
                  },
                },
              ],
              options: { data: { rules: [{ layout: 'split' }] } },
            },

            {
              type: 'experience-composition',
              components: [
                {
                  type: 'oryx-content-link',
                  options: { data: { id: '/', text: '©️ 2023 Spryker' } },
                },
                {
                  type: 'oryx-content-link',
                  options: { data: { id: '/', text: 'Imprint' } },
                },
                {
                  type: 'oryx-content-link',
                  options: { data: { id: '/', text: 'Terms & conditions' } },
                },
                {
                  type: 'oryx-content-link',
                  options: { data: { id: '/', text: 'Privacy Notice' } },
                },
                {
                  type: 'oryx-content-link',
                  options: { data: { id: '/', text: 'Data preference' } },
                },
                {
                  type: 'oryx-content-link',
                  options: { data: { id: '/', text: 'Condition of use' } },
                },
              ],
              options: { data: { rules: [{ layout: 'flex', divider: true }] } },
            },
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
      ],
      options: {
        data: {
          rules: [
            {
              layout: 'flex',
              divider: true,
              align: 'center',
              top: '100%',
              background: 'var(--oryx-color-canvas-200)',
              padding: '30 0',
              bleed: true,
              sticky: true,
            },
          ],
        },
      },
    },
  ],
};
