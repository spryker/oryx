import { ExperienceComponent } from '@spryker-oryx/experience';
import { i18n } from '@spryker-oryx/utilities';

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
        layout: { type: 'flex', vertical: true },
        gap: '30px',
        height: '100vh',
        justify: 'center',
        padding: '8px',
      },
    ],
  },
  components: [
    {
      type: 'oryx-content-image',
      content: { data: { graphic: 'logo' } },
      options: { rules: [{ height: '82px', align: 'start' }] },
    },
    {
      type: 'oryx-content-text',
      content: {
        data: {
          text: `<h3>${i18n('login.welcome')}</h3>`,
        },
      },
      options: { rules: [{ padding: '0 0 20px' }] },
    },
    {
      type: 'oryx-auth-login',
      options: { enableRememberMe: false },
    },
  ],
};
