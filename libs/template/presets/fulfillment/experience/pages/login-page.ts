import {
  CompositionLayout,
  ExperienceComponent,
} from '@spryker-oryx/experience';
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
      { layout: CompositionLayout.Flex, justify: 'center' },
      {
        query: { breakpoint: Size.Sm },
        width: '100%',
      },
      {
        query: { breakpoint: Size.Md },
        width: '530px',
      },
    ],
  },
  components: [{ type: 'oryx-picking-login' }],
};
