import { StaticComponent } from '@spryker-oryx/experience';

export const LoginPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Login Page', route: '/login' },
  components: [
    {
      type: 'auth-login',
      options: {
        data: {
          strategy: 'HOVER',
          showRememberMe: true,
          url: '/contact',
        },
      },
    },
  ],
};
