import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const fulfillmentLoginPage: ExperienceComponent = {
  id: 'fulfillment-login-page',
  type: 'Page',
  meta: {
    title: 'Login Page',
    route: '/login',
    description: 'Login Page Description',
  },
  options: {
    rules: [
      { layout: 'flex', justify: 'center' },
      {
        query: { breakpoint: Size.Sm },
        width: '100%',
      },
    ],
  },
  components: [
    {
      type: 'oryx-picking-login',
    },
  ],
};
