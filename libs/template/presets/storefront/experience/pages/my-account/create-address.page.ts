import { StaticComponent } from '@spryker-oryx/experience';

export const createAddressPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Create address Page',
    route: '/my-account/addresses/create',
  },
  options: {
    data: { rules: [{ layout: 'flex', width: '50%', margin: 'auto' }] },
  },
  components: [{ type: 'oryx-user-address-edit' }],
};
