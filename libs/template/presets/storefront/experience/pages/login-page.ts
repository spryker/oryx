import { ExperienceComponent } from '@spryker-oryx/experience';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { Size, featureVersion } from '@spryker-oryx/utilities';

export const loginPage: ExperienceComponent = {
  id: 'login-page',
  type: 'Page',
  meta: {
    title: 'Login Page',
    route: '/login',
    description: 'Login Page Description',
  },

  ...(featureVersion >= '1.1'
    ? {
        components: [
          featureVersion >= '1.2' ? { ref: 'header' } : {},
          {
            type: 'oryx-composition',
            options: {
              rules: [
                {
                  layout: 'grid',
                  padding: '20px 0',
                  gap: '30px',
                  style: `box-sizing: border-box;`,
                },
                {
                  query: {
                    breakpoint: Size.Lg,
                  },
                  padding: '50px 0',
                },
                {
                  query: {
                    breakpoint: Size.Md,
                  },
                  padding: '30px 0',
                },
                {
                  query: {
                    breakpoint: Size.Sm,
                  },
                  gap: '10px',
                },
              ],
            },
            components: [
              {
                type: 'oryx-composition',
                options: {
                  rules: [
                    { layout: 'list', colSpan: 2 },
                    {
                      query: { breakpoint: Size.Md },
                      width: '80%',
                      colSpan: 3,
                    },
                    {
                      query: { breakpoint: Size.Lg },
                      gridColumn: 2,
                      colSpan: 2,
                    },
                  ],
                },
                components: [
                  {
                    type: 'oryx-content-text',
                    content: { data: { text: `<h2>Log in</h2>` } },
                  },
                  { type: 'oryx-auth-login' },
                  {
                    type: 'oryx-composition',
                    options: {
                      rules: [
                        {
                          layout: 'grid',
                          gap: '20px',
                          margin: '20px 0 0',
                          style: `grid-template-columns: 1fr 1fr`,
                        },
                      ],
                    },
                    components: [
                      {
                        type: 'oryx-content-text',
                        content: { data: { text: `<h2>New customer</h2>` } },
                        options: {
                          rules: [
                            {
                              colSpan: 2,
                            },
                          ],
                        },
                      },
                      {
                        type: 'oryx-content-text',
                        content: {
                          data: {
                            text: `<p>New here? Create an account for a smoother shopping experience!</p>`,
                          },
                        },
                        options: {
                          rules: [
                            {
                              colSpan: 2,
                              margin: '0 0 10px',
                            },
                          ],
                        },
                      },
                      {
                        type: 'oryx-content-text',
                        content: {
                          data: {
                            text: `<oryx-button href="/registration" type=${ButtonType.Outline} size=${ButtonSize.Md} style="width: 100%">Create account</oryx-button>`,
                          },
                        },
                        options: {
                          rules:
                            featureVersion >= '1.3'
                              ? [{ query: { breakpoint: Size.Sm }, colSpan: 2 }]
                              : [],
                        },
                      },
                    ],
                  },
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
      }
    : {
        options: {
          rules: [{ layout: 'flex', padding: '30px 0' }],
        },
        components: [
          {
            type: 'oryx-auth-login',
            options: {
              rules: [{ width: '50%', margin: 'auto' }],
            },
          },
        ],
      }),
};
