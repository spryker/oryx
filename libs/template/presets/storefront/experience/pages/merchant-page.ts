import { ExperienceComponent } from '@spryker-oryx/experience';

export const merchantPage: ExperienceComponent = {
  id: 'merchant-page',
  type: 'Page',
  meta: {
    title: 'Merchant Page',
    route: '/merchant/:merchant',
    description: 'Default Merchant Page Description',
  },
  options: {
    rules: [
      {
        layout: 'split-main',
        padding: '30px 0',
      },
    ],
  },

  components: [
    {
      type: 'oryx-merchant-banner',
      options: {
        rules: [{ colSpan: 2, height: '250px' }],
      },
    },

    {
      type: 'oryx-composition',
      components: [
        { type: 'oryx-merchant-title' },
        { type: 'oryx-merchant-legal' },
        { type: 'oryx-merchant-description' },
      ],
      options: {
        rules: [{ layout: 'list' }],
      },
    },

    {
      type: 'oryx-composition',
      components: [
        {
          type: 'oryx-merchant-logo',
          options: { rules: [{ width: '100px' }] },
        },
        { type: 'oryx-merchant-openings-hours' },
        { type: 'oryx-merchant-contact' },
      ],
      options: {
        rules: [{ layout: 'list' }],
      },
    },
  ],
};
