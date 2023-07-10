import { StaticComponent } from '@spryker-oryx/experience';

export const editAddressPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Edit address page',
    route: '/my-account/addresses/edit/:id',
  },
  options: {
    data: { rules: [{ layout: 'flex', width: '50%', margin: 'auto' }] },
  },
  components: [{ type: 'oryx-user-address-edit' }],
};
