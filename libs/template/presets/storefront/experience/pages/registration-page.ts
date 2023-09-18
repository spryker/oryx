import {
  CompositionLayout,
  ExperienceComponent,
  LayoutAlign,
} from '@spryker-oryx/experience';
import { ButtonType } from '@spryker-oryx/ui/button';
import { Size, featureVersion } from '@spryker-oryx/utilities';

export const registrationPage: ExperienceComponent | undefined =
  featureVersion >= '1.1'
    ? {
        id: 'registration-page',
        type: 'Page',
        meta: {
          title: 'Registration Page',
          route: '/registration',
          description: 'Registration Page Description',
        },
        options: {
          rules: [
            {
              layout: CompositionLayout.Flex,
              padding: '20px 16px',
              width: '100%',
              justify: 'center',
              gap: '30px',
            },
            {
              query: {
                breakpoint: Size.Lg,
              },
              padding: '50px 0',
              width: '50%',
            },
            {
              query: {
                breakpoint: Size.Md,
              },
              padding: '30px 0',
              width: '80%',
            },
          ],
        },
        components: [
          {
            type: 'oryx-composition',
            options: {
              rules: [
                {
                  layout: CompositionLayout.Grid,
                  columns: 2,
                  gap: '20px',
                  justify: LayoutAlign.Start,
                  width: '100%',
                },
              ],
            },
            components: [
              {
                type: 'oryx-content-text',
                options: {
                  rules: [
                    {
                      colSpan: 2,
                    },
                  ],
                },
                content: {
                  data: {
                    text: `
                      <h5>Have an account?</h5>
                    `,
                  },
                },
              },
              {
                type: 'oryx-content-text',
                options: {
                  rules: [
                    {
                      width: '100%',
                    },
                  ],
                },
                content: {
                  data: {
                    text: `
                      <oryx-button type=${ButtonType.Outline} href="/login" style="width: 100%">Login</oryx-button>
                    `,
                  },
                },
              },
              {
                type: 'oryx-content-text',
                options: {
                  rules: [
                    {
                      colSpan: 2,
                      margin: '10px 0 0',
                    },
                  ],
                },
                content: {
                  data: {
                    text: `
                  <h1>New customer</h1>
                `,
                  },
                },
              },
            ],
          },
          {
            type: 'oryx-user-registration',
            options: {
              rules: [
                {
                  width: '100%',
                },
              ],
              minLength: 8,
              minUppercaseChars: 1,
              minNumbers: 1,
              minSpecialChars: 1,
            },
          },
        ],
      }
    : undefined;
