import { ExperienceComponent } from '@spryker-oryx/experience';

export const fulfillmentLoginPage: ExperienceComponent = {
  id: 'fulfillment-login-page',
  type: 'Page',
  meta: {
    title: 'Login Page',
    route: '/login',
    description: 'Login Page Description',
  },
  options: {
    rules: [{ layout: 'list' }],
  },
  components: [
    {
      type: 'oryx-picking-login',
    },
    { ref: 'service' }
  ],
};
