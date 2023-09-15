import { ExperienceComponent } from '@spryker-oryx/experience';
import { featureVersion, Size } from '@spryker-oryx/utilities';

export const registrationPage: ExperienceComponent | undefined =
  featureVersion === '1.1'
    ? {
        id: 'registration-page',
        type: 'Page',
        meta: {
          title: 'Registration Page',
          route: '/registration',
          description: 'Registration Page Description',
        },
        options: {
          rules: [{ layout: 'flex', padding: '30px 0' }],
        },
        components: [
          {
            type: 'oryx-user-registration',
            options: {
              rules: [
                {
                  width: '100%',
                },
                {
                  query: {
                    breakpoint: Size.Lg,
                  },
                  width: '50%',
                  margin: 'auto',
                },
                {
                  query: {
                    breakpoint: Size.Md,
                  },
                  width: '80%',
                  margin: 'auto',
                },
              ],
              minLength: 8,
              minUppercaseChars: 1,
              minNumbers: 1,
              minSpecialChars: 1,
            },
          },
        ],
      }
    : undefined;
