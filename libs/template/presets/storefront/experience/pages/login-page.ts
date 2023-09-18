import { ExperienceComponent } from '@spryker-oryx/experience';
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
    rules: [{ layout: 'flex', padding: '30px 0' }],
  },
  components: [
    {
      type: 'oryx-auth-login',
      options: {
        rules: [
          {
            width: '100%',
          },
          {
            query: {
              breakpoint: Size.Lg,
            },
            width: '50%',
            margin: 'auto',
          },
          {
            query: {
              breakpoint: Size.Md,
            },
            width: '80%',
            margin: 'auto',
          },
        ],
      },
    },
  ],
};
