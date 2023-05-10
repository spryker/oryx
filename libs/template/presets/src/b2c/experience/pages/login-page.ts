import { StaticComponent } from '@spryker-oryx/experience';

export const LoginPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Login Page',
    route: '/login',
    description: 'Login Page Description',
  },
  components: [
    {
      type: 'experience-composition',
      options: {
        data: {
          rules: [{ container: true, margin: '30px 0' }],
        },
      },
      components: [{ type: 'oryx-auth-login' }],
    },
  ],
};
