import { ExperienceComponent } from '@spryker-oryx/experience';

export const createAddressPage: ExperienceComponent = {
  id: 'create-address',
  type: 'Page',
  meta: {
    title: 'Create address Page',
    route: '/my-account/addresses/create',
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      id: 'createAddressBody',
      options: {
        rules: [{ layout: 'flex', width: '50%', margin: 'auto' }],
      },
      components: [{ type: 'oryx-user-address-edit' }],
    },
    { ref: 'footer' },
  ],
};
