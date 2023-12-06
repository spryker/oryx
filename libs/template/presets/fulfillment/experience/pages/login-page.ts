import { ExperienceComponent } from '@spryker-oryx/experience';
import { featureVersion } from '@spryker-oryx/utilities';

export const fulfillmentLoginPage: ExperienceComponent = {
  id: 'fulfillment-login-page',
  type: 'Page',
  meta: {
    title: 'Login Page',
    route: '/login',
    description: 'Login to access the fulfillment app',
  },
  options: {
    rules: [
      {
        layout: {
          ...(featureVersion >= '1.4'
            ? { type: 'list' }
            : { type: 'flex', vertical: true }),
        },
        gap: '30px',
        height: '100vh',
        width: 'min(440px, calc(100% - 16px))',
        justify: 'center',
        padding: '8px',
      },
    ],
  },
  components: [
    {
      type: 'oryx-content-image',
      content: { data: { graphic: 'logo' } },
      options: { rules: [{ height: '82px', align: 'center' }] },
    },
    {
      type: 'oryx-content-text',
      content: {
        data: { text: `<h3>Welcome! Please log in to start picking.</h3>` },
      },
      options: { rules: [{ padding: '0 0 20px', align: 'center' }] },
    },
    {
      type: 'oryx-auth-login',
      options: { enableRememberMe: false },
    },
    { ref: 'service' },
  ],
};
