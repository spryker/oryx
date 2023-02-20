import { Component } from '@spryker-oryx/experience';

export const LoginPage: Component<unknown> = {
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
