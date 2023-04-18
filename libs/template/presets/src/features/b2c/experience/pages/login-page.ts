import { StaticComponent } from '@spryker-oryx/experience';

export const LoginPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Login Page', route: '/login' },
  options: {
    data: {
      rules: [{ layout: 'free', padding: '30px 0 0' }],
    },
  },
  components: [
    {
      type: 'oryx-auth-login',
      options: {
        data: {
          rules: [{ width: '50%', margin: 'auto' }],
        },
      },
    },
  ],
};
