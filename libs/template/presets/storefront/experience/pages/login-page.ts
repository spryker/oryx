import { ExperienceComponent } from '@spryker-oryx/experience';
import { featureVersion } from '@spryker-oryx/utilities';

export const loginPage: ExperienceComponent = {
  id: 'login-page',
  type: 'Page',
  meta: {
    title: 'Login Page',
    route: '/login',
    description: 'Login Page Description',
  },
  components: [
    featureVersion >= '1.1'
      ? {
          ref: 'header',
        }
      : {},
    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-auth-login',
          options: {
            rules: [{ width: '50%', margin: 'auto' }],
          },
        },
      ],
      options: {
        rules: [{ layout: 'flex', padding: '30px 0' }],
      },
    },
    featureVersion >= '1.1'
      ? {
          ref: 'footer',
        }
      : {},
  ],
};
