import { ExperienceComponent } from '@spryker-oryx/experience';

export const loginPage: ExperienceComponent = {
  id: 'login',
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
        rules: [{ width: '50%', margin: 'auto' }],
      },
    },
  ],
};
