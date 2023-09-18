import {
  CompositionLayout,
  ExperienceComponent,
  LayoutAlign,
} from '@spryker-oryx/experience';
import { ButtonType } from '@spryker-oryx/ui/button';
import { Size } from '@spryker-oryx/utilities';

export const loginPage: ExperienceComponent = {
  id: 'login-page',
  type: 'Page',
  meta: {
    title: 'Login Page',
    route: '/login',
    description: 'Login Page Description',
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
      type: 'oryx-content-text',
      content: {
        data: {
          text: `
            <h2>Log in</h2>
          `,
        },
      },
      options: {
        rules: [
          {
            width: '100%',
          },
        ],
      },
    },
    {
      type: 'oryx-auth-login',
      options: {
        rules: [
          {
            width: '100%',
          },
        ],
      },
    },
    {
      type: 'oryx-composition',
      options: {
        rules: [
          {
            layout: CompositionLayout.Grid,
            columns: 2,
            gap: '20px 30px',
            justify: LayoutAlign.Start,
            width: '100%',
            margin: '20px 0 0',
          },
        ],
      },
      components: [
        {
          type: 'oryx-content-text',
          content: {
            data: {
              text: `
                <h2>New customer</h2>
                <p style="margin-block-start: 20px">New here? Create an account for a smoother shopping experience!</p>
              `,
            },
          },
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
              text: `
                <oryx-button href="/registration" type=${ButtonType.Outline} style="width: 100%">Create account</oryx-button>
              `,
            },
          },
          options: {
            rules: [
              {
                width: '100%',
              },
            ],
          },
        },
      ],
    },
  ],
};
