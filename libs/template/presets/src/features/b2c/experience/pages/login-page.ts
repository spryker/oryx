import { StaticComponent } from '@spryker-oryx/experience';

export const LoginPage: StaticComponent = {
  type: 'Page',
  meta: { title: 'Login Page', route: '/login' },
  components: [
    {
      type: 'experience-composition',
      options: {
        data: {
          rules: [{ container: true, layout: 'tabular', margin: '30px 0' }],
        },
      },
      components: [
        {
          type: 'auth-login',
          name: 'Login',
          options: {
            data: {
              strategy: 'HOVER',
              showRememberMe: true,
              url: '/contact',
            },
          },
        },
      ],
    },
  ],
};
